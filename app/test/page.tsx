"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Page() {
  const [city, setCity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);

  // ------------------- FETCH FUNCTIONS -------------------
  const fetchCities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visited_cities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("❌ Fetch error:", error.message);
    else setCities(data ?? []);

    setLoading(false);
  };

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("❌ Gallery fetch error:", error.message);
    else setGallery(data ?? []);
  };

  useEffect(() => {
    fetchCities();
    fetchGallery();
  }, []);

  // ------------------- ADD CITY -------------------
  const addCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    let imageUrl: string | null = null;

    if (imageFile) {
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
      const fileName = `cities/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("travel")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("❌ Upload error:", uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("travel").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("visited_cities")
      .insert([{ city_name: city.trim(), image_url: imageUrl }]);

    if (error) console.error("❌ Insert error:", error.message);
    else {
      setCity("");
      setImageFile(null);
      fetchCities();
    }
  };

  // ------------------- UPLOAD TO GALLERY -------------------
  const uploadGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) return;

    const safeName = galleryFile.name.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
    const fileName = `gallery/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("travel")
      .upload(fileName, galleryFile);

    if (uploadError) {
      console.error("❌ Gallery upload error:", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("travel").getPublicUrl(fileName);
    const imageUrl = data.publicUrl;

    const { error } = await supabase.from("gallery_images").insert([{ image_url: imageUrl }]);

    if (error) console.error("❌ Gallery insert error:", error.message);
    else {
      setGalleryFile(null);
      fetchGallery();
    }
  };

  // ------------------- UI -------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-6 gap-12">
      
      {/* City Section */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          🌍 My Travel Journal
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Keep track of all the cities you have visited with photos.
        </p>

        {/* City form */}
        <form onSubmit={addCity} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city name..."
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black shadow-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
          >
            Add City
          </button>
        </form>

        {/* City list */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : cities.length > 0 ? (
          <ul className="space-y-3">
            {cities.map((c) => (
              <li
                key={c.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div>
                  <span className="font-medium text-gray-800 block">{c.city_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={c.city_name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No cities added yet. Start by adding your first one!
          </p>
        )}
      </div>

      {/* Gallery Section */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          📸 Travel Gallery
        </h2>

        {/* Gallery upload */}
        <form onSubmit={uploadGalleryImage} className="flex flex-col gap-4 mb-8">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition"
          >
            Upload Image
          </button>
        </form>

        {/* Gallery grid */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((g) => (
              <img
                key={g.id}
                src={g.image_url}
                alt="Gallery"
                className="w-full h-40 object-cover rounded-lg border shadow-sm hover:shadow-md transition"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No images yet. Add some memories!</p>
        )}
      </div>
    </main>
  );
}
