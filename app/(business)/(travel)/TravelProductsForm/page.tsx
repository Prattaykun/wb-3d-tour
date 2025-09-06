"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ========================= Helper Types =========================
type FileWithPreview = File & { preview?: string };

type FoodItemForm = { name: string; images: FileWithPreview[] };
type MealForm = { items: FoodItemForm[] };
type SiteStopForm = { name: string; stayHours: number; images: FileWithPreview[] };

type DayPlanForm = {
  dayNumber: number;
  sites: SiteStopForm[];
  food: {
    breakfast: MealForm;
    lunch: MealForm;
    snacks: MealForm;
    dinner: MealForm;
  };
};

type CategoryPlanForm = {
  categoryName: string;
  days: number;
  nights: number;
  travelMode: string;
  pricing: { inr: number; eth: number; btc: number };
  itinerary: DayPlanForm[];
};

type TravelProductsForm = { packageName: string; categories: CategoryPlanForm[] };

// ========================= Supabase Client =========================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========================= Utility factories =========================
const emptyFoodItem = (): FoodItemForm => ({ name: "", images: [] });
const emptyMeal = (): MealForm => ({ items: [emptyFoodItem()] });
const emptyStop = (): SiteStopForm => ({ name: "", stayHours: 0, images: [] });
const emptyDay = (n: number): DayPlanForm => ({
  dayNumber: n,
  sites: [emptyStop()],
  food: {
    breakfast: emptyMeal(),
    lunch: emptyMeal(),
    snacks: emptyMeal(),
    dinner: emptyMeal(),
  },
});
const emptyCategory = (name: string): CategoryPlanForm => ({
  categoryName: name,
  days: 1,
  nights: 0,
  travelMode: "",
  pricing: { inr: 0, eth: 0, btc: 0 },
  itinerary: [emptyDay(1)],
});

// ========================= Cloudinary Upload =========================
const uploadManyToCloudinary = async (
  files: FileWithPreview[],
  pathPrefix: string
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    formData.append("folder", `travel-products/${pathPrefix}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    urls.push(data.secure_url);
  }
  return urls;
};

// ========================= Component =========================
export default function TravelAgencyProductsForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<TravelProductsForm & { thumbnail?: FileWithPreview | null }>({
  packageName: "",
  thumbnail: null,
  categories: [
    emptyCategory("Budget"),
    emptyCategory("Luxurious"),
    emptyCategory("Dream"),
  ],
});


  // Clean up previews
  useEffect(() => {
    return () => {
      form.categories.forEach((c) => {
        c.itinerary.forEach((d) => {
          d.sites.forEach((s) =>
            s.images.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
          );
          ["breakfast", "lunch", "snacks", "dinner"].forEach((mealKey) => {
            const meal = (d.food as any)[mealKey] as MealForm;
            meal.items.forEach((it) =>
              it.images.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
            );
          });
        });
      });
    };
  }, [form]);

  // Helpers
  const setCategory = (
    idx: number,
    updater: (c: CategoryPlanForm) => CategoryPlanForm
  ) => {
    setForm((prev) => {
      const copy = structuredClone(prev) as TravelProductsForm;
      copy.categories[idx] = updater(copy.categories[idx]);
      return copy;
    });
  };

  const toFileArray = (list: FileList | null): FileWithPreview[] => {
    if (!list) return [];
    const arr = Array.from(list) as FileWithPreview[];
    arr.forEach((f) => (f.preview = URL.createObjectURL(f)));
    return arr;
  };

  // ============= Extra UI helpers =============
  const updateField = (key: keyof TravelProductsForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addCategory = () => {
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, emptyCategory(`Category ${prev.categories.length + 1}`)],
    }));
  };

  const removeCategory = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== idx),
    }));
  };

  const addDay = (catIdx: number) => {
    setCategory(catIdx, (c) => {
      const newDay = emptyDay(c.itinerary.length + 1);
      return { ...c, itinerary: [...c.itinerary, newDay] };
    });
  };

  const removeDay = (catIdx: number, dayIdx: number) => {
    setCategory(catIdx, (c) => {
      const it = [...c.itinerary].filter((_, i) => i !== dayIdx);
      return { ...c, itinerary: it };
    });
  };

  const handleDaysChange = (catIdx: number, days: number) => {
    setCategory(catIdx, (c) => {
      let itinerary = [...c.itinerary];
      if (days > itinerary.length) {
        for (let i = itinerary.length; i < days; i++) {
          itinerary.push(emptyDay(i + 1));
        }
      } else if (days < itinerary.length) {
        itinerary = itinerary.slice(0, days);
      }
      return { ...c, days, itinerary };
    });
  };


// ---------------- Submit ----------------
// ---------------- Submit ----------------
const onSubmit = async () => {
  setBusy(true);
  setMessage(null);

  try {
    // 1. Get logged in user
    const { data: userResp, error: userErr } = await supabase.auth.getUser();
    if (userErr) throw userErr;
    const user = userResp.user;
    if (!user) throw new Error("You must be logged in to submit a travel product.");

    // 2. Fetch org_name
    const { data: profile, error: profileErr } = await supabase
      .from("business_profiles")
      .select("org_name")
      .eq("id", user.id)
      .single();
    if (profileErr) throw profileErr;
    const orgName = profile?.org_name || null;

    // 3. Build product payload
    const productId = crypto.randomUUID();
    let thumbnailUrl: string | null = null;

    if (form.thumbnail) {
      const [uploaded] = await uploadManyToCloudinary(
        [form.thumbnail],
        `${user.id}/${productId}/thumbnail`
      );
      thumbnailUrl = uploaded;
    }

    // === Build categoriesClean ===
    const categoriesClean = [];
    for (const [catIdx, cat] of form.categories.entries()) {
      const itineraryClean = [];

      for (const [dayIdx, day] of cat.itinerary.entries()) {
        // Process sites with image upload
        const sitesClean = [];
        for (const [stopIdx, stop] of day.sites.entries()) {
          const siteImgs = stop.images?.length
            ? await uploadManyToCloudinary(
                stop.images,
                `${user.id}/${productId}/cat-${catIdx + 1}/day-${dayIdx + 1}/stop-${stopIdx + 1}`
              )
            : [];
          sitesClean.push({
            name: stop.name,
            stayHours: stop.stayHours,
            images: siteImgs,
          });
        }

        // Process meals with image upload
        const foodClean: any = {};
        for (const mealKey of ["breakfast", "lunch", "snacks", "dinner"] as const) {
          const meal = day.food[mealKey];
          const itemsClean = [];
          for (const [itemIdx, item] of meal.items.entries()) {
            const itemImgs = item.images?.length
              ? await uploadManyToCloudinary(
                  item.images,
                  `${user.id}/${productId}/cat-${catIdx + 1}/day-${dayIdx + 1}/food-${mealKey}-${itemIdx + 1}`
                )
              : [];
            itemsClean.push({ name: item.name, images: itemImgs });
          }
          foodClean[mealKey] = { items: itemsClean };
        }

        itineraryClean.push({
          dayNumber: day.dayNumber,
          sites: sitesClean,
          food: foodClean,
        });
      }

      categoriesClean.push({
        categoryName: cat.categoryName,
        days: cat.days,
        nights: cat.nights,
        travelMode: cat.travelMode,
        pricing: cat.pricing,
        itinerary: itineraryClean,
      });
    }

    // Final payload
    const payload = {
      product_id: productId,
      user_id: user.id,
      package_name: form.packageName,
      thumbnail: thumbnailUrl,
      categories: categoriesClean,   // ✅ now filled
      org_name: orgName,
    };

    // 4. Send to embed API
    const embedResp = await fetch("/api/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "travel_products", data: payload }),
    });

    const embedData = await embedResp.json();
    if (!embedResp.ok) throw new Error(embedData.error || "Failed to add product via embed API");

    setMessage("Travel product saved successfully with categories & org_name ✅");
  } catch (e: any) {
    console.error(e);
    setMessage(`Error: ${e.message || "unknown error"}`);
  } finally {
    setBusy(false);
  }
};





  // -------------- UI --------------

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-4">Travel Agency Products</h1>
      <p className="text-sm text-gray-600 mb-6">
        Create multi-category travel packages. Categories can be Budget / Luxurious / Dream or any custom set you add.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Package Name</label>
        <input
          type="text"
          className="w-full rounded-xl border p-3"
          placeholder="e.g., Golden Triangle – 6N/7D"
          value={form.packageName}
          onChange={(e) => updateField("packageName", e.target.value)}
        />
      </div>
      <div className="mb-6">
  <label className="block text-sm font-medium mb-1">Thumbnail</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0] as FileWithPreview;
      if (file) {
        file.preview = URL.createObjectURL(file);
        setForm((prev) => ({ ...prev, thumbnail: file }));
      }
    }}
  />
  {form.thumbnail && (
    <img
      src={form.thumbnail.preview}
      alt="thumbnail preview"
      className="mt-2 h-24 w-24 object-cover rounded"
    />
  )}
</div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          type="button"
          onClick={addCategory}
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          + Add Category
        </button>
      </div>

      <div className="space-y-8">
        {form.categories.map((cat, catIdx) => (
          <div key={catIdx} className="rounded-2xl border p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="rounded-xl border p-2 font-semibold"
                  value={cat.categoryName}
                  placeholder={`Category ${catIdx + 1} name (e.g., Budget)`}
                  onChange={(e) =>
                    setCategory(catIdx, (c) => ({ ...c, categoryName: e.target.value }))
                  }
                />
                <span className="text-xs text-gray-500">ID: cat-{catIdx + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeCategory(catIdx)}
                className="text-red-600 text-sm"
                disabled={form.categories.length <= 1}
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border p-2"
                  value={cat.days}
                  onChange={(e) => handleDaysChange(catIdx, Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nights</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border p-2"
                  value={cat.nights}
                  onChange={(e) => setCategory(catIdx, (c) => ({ ...c, nights: Number(e.target.value) }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Travel Mode</label>
                <input
                  type="text"
                  className="w-full rounded-xl border p-2"
                  placeholder="e.g., Flight + AC Coach"
                  value={cat.travelMode}
                  onChange={(e) => setCategory(catIdx, (c) => ({ ...c, travelMode: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (INR)</label>
                <input
                  type="number"
                  max={0}
                  className="w-full rounded-xl border p-2"
                  value={cat.pricing.inr}
                  onChange={(e) => setCategory(catIdx, (c) => ({ ...c, pricing: { ...c.pricing, inr: Number(e.target.value) } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                <input
                  type="number"
                  max={0}
                  step="0.00000001"
                  className="w-full rounded-xl border p-2"
                  value={cat.pricing.eth}
                  onChange={(e) => setCategory(catIdx, (c) => ({ ...c, pricing: { ...c.pricing, eth: Number(e.target.value) } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (BTC)</label>
                <input
                  type="number"
                  max={0}
                  step="0.00000001"
                  className="w-full rounded-xl border p-2"
                  value={cat.pricing.btc}
                  onChange={(e) => setCategory(catIdx, (c) => ({ ...c, pricing: { ...c.pricing, btc: Number(e.target.value) } }))}
                />
              </div>
            </div>

            {/* Days & Branches */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Itinerary & Food (Days 1–{cat.itinerary.length})</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addDay(catIdx)}
                    className="rounded-xl bg-gray-800 text-white px-3 py-1"
                  >
                    + Add Day
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {cat.itinerary.map((day, dayIdx) => (
                  <div key={dayIdx} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Day {day.dayNumber}</div>
                      <button
                        type="button"
                        onClick={() => removeDay(catIdx, dayIdx)}
                        className="text-xs text-red-600"
                        disabled={cat.itinerary.length <= 1}
                      >
                        Remove Day
                      </button>
                    </div>

                    {/* Stops */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Stops for Stay</div>
                        <button
                          type="button"
                          onClick={() =>
                            setCategory(catIdx, (c) => {
                              const it = [...c.itinerary];
                              const d = { ...it[dayIdx] };
                              d.sites = [...d.sites, emptyStop()];
                              it[dayIdx] = d;
                              return { ...c, itinerary: it };
                            })
                          }
                          className="text-xs rounded-lg bg-black text-white px-2 py-1"
                        >
                          + Add Stop
                        </button>
                      </div>

                      <div className="space-y-4">
                        {day.sites.map((stop, stopIdx) => (
                          <div key={stopIdx} className="rounded-lg border p-3">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                              <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">Stop Name</label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border p-2"
                                  placeholder="e.g., Amber Fort"
                                  value={stop.name}
                                  onChange={(e) =>
                                    setCategory(catIdx, (c) => {
                                      const it = [...c.itinerary];
                                      const d = { ...it[dayIdx] };
                                      const sites = [...d.sites];
                                      sites[stopIdx] = { ...sites[stopIdx], name: e.target.value };
                                      d.sites = sites;
                                      it[dayIdx] = d;
                                      return { ...c, itinerary: it };
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Stay Hours</label>
                                <input
                                  type="number"
                                  min={0}
                                  step="0.5"
                                  className="w-full rounded-xl border p-2"
                                  value={stop.stayHours}
                                  onChange={(e) =>
                                    setCategory(catIdx, (c) => {
                                      const it = [...c.itinerary];
                                      const d = { ...it[dayIdx] };
                                      const sites = [...d.sites];
                                      sites[stopIdx] = { ...sites[stopIdx], stayHours: Number(e.target.value) };
                                      d.sites = sites;
                                      it[dayIdx] = d;
                                      return { ...c, itinerary: it };
                                    })
                                  }
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Site Images</label>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) =>
                                    setCategory(catIdx, (c) => {
                                      const it = [...c.itinerary];
                                      const d = { ...it[dayIdx] };
                                      const sites = [...d.sites];
                                      const prev = sites[stopIdx].images || [];
                                      const next = toFileArray(e.target.files);
                                      sites[stopIdx] = { ...sites[stopIdx], images: [...prev, ...next] };
                                      d.sites = sites;
                                      it[dayIdx] = d;
                                      return { ...c, itinerary: it };
                                    })
                                  }
                                />
                                {stop.images?.length ? (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {stop.images.map((f, i) => (
                                      <img key={i} src={f.preview} className="h-12 w-12 object-cover rounded" alt="preview" />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Food */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(Object.keys(day.food) as (keyof DayPlanForm["food"])[]).map((mealKey) => {
                        const meal = day.food[mealKey];
                        return (
                          <div key={mealKey} className="rounded-xl border p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium capitalize">{mealKey}</div>
                              <button
                                type="button"
                                onClick={() =>
                                  setCategory(catIdx, (c) => {
                                    const it = [...c.itinerary];
                                    const d = { ...it[dayIdx] };
                                    const f = { ...d.food } as any;
                                    f[mealKey] = { ...f[mealKey], items: [...f[mealKey].items, emptyFoodItem()] };
                                    d.food = f;
                                    it[dayIdx] = d;
                                    return { ...c, itinerary: it };
                                  })
                                }
                                className="text-xs rounded-lg bg-black text-white px-2 py-1"
                              >
                                + Add Item
                              </button>
                            </div>

                            <div className="space-y-3">
                              {meal.items.map((it, itemIdx) => (
                                <div key={itemIdx} className="rounded-lg border p-2">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium mb-1">Item Name</label>
                                      <input
                                        type="text"
                                        className="w-full rounded-xl border p-2"
                                        placeholder="e.g., Masala Dosa"
                                        value={it.name}
                                        onChange={(e) =>
                                          setCategory(catIdx, (c) => {
                                            const itin = [...c.itinerary];
                                            const d = { ...itin[dayIdx] };
                                            const f = { ...d.food } as any;
                                            const items = [...f[mealKey].items];
                                            items[itemIdx] = { ...items[itemIdx], name: e.target.value };
                                            f[mealKey] = { ...f[mealKey], items };
                                            d.food = f;
                                            itin[dayIdx] = d;
                                            return { ...c, itinerary: itin };
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Images</label>
                                      <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) =>
                                          setCategory(catIdx, (c) => {
                                            const itin = [...c.itinerary];
                                            const d = { ...itin[dayIdx] };
                                            const f = { ...d.food } as any;
                                            const items = [...f[mealKey].items];
                                            const prev = items[itemIdx].images || [];
                                            const next = toFileArray(e.target.files);
                                            items[itemIdx] = { ...items[itemIdx], images: [...prev, ...next] };
                                            f[mealKey] = { ...f[mealKey], items };
                                            d.food = f;
                                            itin[dayIdx] = d;
                                            return { ...c, itinerary: itin };
                                          })
                                        }
                                      />
                                      {it.images?.length ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {it.images.map((f, i) => (
                                            <img key={i} src={f.preview} className="h-12 w-12 object-cover rounded" alt="preview" />
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className="rounded-2xl bg-green-600 text-white px-5 py-3 disabled:opacity-60"
        >
          {busy ? "Saving..." : "Submit "}
        </button>
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
