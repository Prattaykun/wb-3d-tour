// ClientChatForm.tsx
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import clsx from "clsx";

// Supabase browser client
const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ClientChatFormProps = {
  userId: string;
  defaultEmail?: string;
  defaultName?: string;
  existingData?: any;
};

type StepKey =
  | "org"
  | "email"
  | "phone"
  | "types"
  | "links"
  | "images"
  | "review";

const BUSINESS_TYPES = [
  "travel agency",
  "artisan",
  "hotel & resort",
  "event organiser",
] as const;

export default function ClientChatForm({
  userId,
  defaultEmail,
  defaultName,
  existingData,
}: ClientChatFormProps) {
  const [current, setCurrent] = useState<StepKey>("org");
  const [org, setOrg] = useState(defaultName || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [phone, setPhone] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([""]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<null | { type: "ok" | "err"; msg: string }>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Initialize with existing data if available
  useEffect(() => {
    if (existingData) {
      setOrg(existingData.org_name || "");
      setEmail(existingData.email || "");
      setPhone(existingData.phone || "");
      setTypes(existingData.business_types || []);
      setLinks(existingData.links && existingData.links.length > 0 
        ? existingData.links 
        : [""]
      );
      
      // Handle both string and array formats for images
      if (Array.isArray(existingData.images)) {
        setImageUrls(existingData.images);
      } else if (typeof existingData.images === 'string') {
        try {
          // Try to parse if it's a string representation of an array
          const parsedImages = JSON.parse(existingData.images);
          setImageUrls(Array.isArray(parsedImages) ? parsedImages : []);
        } catch (e) {
          console.error("Error parsing images:", e);
          setImageUrls([]);
        }
      } else {
        setImageUrls([]);
      }
    }
  }, [existingData]);
  
  const steps = useMemo<StepKey[]>(() => ["org", "email", "phone", "types", "links", "images", "review"], []);

  const canContinue = useMemo(() => {
    switch (current) {
      case "org":
        return org.trim().length >= 2;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case "phone":
        return /^[0-9+\-\s()]{6,}$/.test(phone);
      case "types":
        return types.length > 0;
      case "links":
        return links.every((l) => l.trim().length === 0 || isValidURL(l));
      case "images":
      case "review":
        return true;
      default:
        return false;
    }
  }, [current, org, email, phone, types, links]);

  function next() {
    const idx = steps.indexOf(current);
    if (idx < steps.length - 1) setCurrent(steps[idx + 1]);
    setTimeout(() => scrollerRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 0);
  }

  function prev() {
    const idx = steps.indexOf(current);
    if (idx > 0) setCurrent(steps[idx - 1]);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setToast({
        type: "err",
        msg: "Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
      });
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
        const form = new FormData();
        form.append("file", f);
        form.append("upload_preset", uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        uploaded.push(data.secure_url as string);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
      setToast({ type: "ok", msg: "Image(s) uploaded." });
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Image upload failed." });
    } finally {
      setUploading(false);
    }
  }

   async function saveToSupabase() {
    setSaving(true);
    setToast(null);
    try {
      // Ensure images is properly formatted as an array
      const imagesArray = Array.isArray(imageUrls) ? imageUrls : [];
      
      const payload = {
        id: userId,
        org_name: org.trim(),
        email: email.trim(),
        phone: phone.trim(),
        business_types: types,
        links: links.filter((l) => l.trim().length > 0),
        images: imagesArray, // This should now be a proper array
        updated_at: new Date().toISOString(),
      };

      // Use upsert to either insert or update
      const { error } = await supabaseBrowser
        .from("business_profiles")
        .upsert(payload);
      
      if (error) throw error;

      setToast({ type: "ok", msg: existingData ? "Updated successfully! Redirecting…" : "Saved successfully! Redirecting…" });

      if (existingData) {
        setTimeout(() => {
          window.location.href = "/BusinessDashboard";
        }, 900);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 900);
      }
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Failed to save." });
    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-white to-blue-50 shadow-lg text-blue-900">
      {/* Chat window */}
      <div ref={scrollerRef} className="max-h-[70vh] overflow-auto p-4 sm:p-6 space-y-4">
        <BotBubble>
          {existingData 
            ? "Let's update your business information. I'll ask a few questions, and then we'll save the changes."
            : "Hey! Let's register your business. I'll ask a few questions, and then we'll save it."
          }
        </BotBubble>

        {/* ORG */}
        <BotBubble>What's your organization name?</BotBubble>
        {current === "org" ? (
          <YouBubble active>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Enter organization name..."
              className="w-full bg-transparent outline-none placeholder-blue-300"
            />
          </YouBubble>
        ) : org && <YouBubble>{org}</YouBubble>}

        {/* EMAIL */}
        {current !== "org" && (
          <>
            <BotBubble>What's your business email?</BotBubble>
            {current === "email" ? (
              <YouBubble active>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="w-full bg-transparent outline-none placeholder-blue-300"
                />
              </YouBubble>
            ) : email && <YouBubble>{email}</YouBubble>}
          </>
        )}

        {/* PHONE */}
        {steps.indexOf(current) >= steps.indexOf("phone") && (
          <>
            <BotBubble>What's your contact number?</BotBubble>
            {current === "phone" ? (
              <YouBubble active>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone..."
                  className="w-full bg-transparent outline-none placeholder-blue-300"
                />
              </YouBubble>
            ) : phone && <YouBubble>{phone}</YouBubble>}
          </>
        )}

        {/* TYPES */}
        {steps.indexOf(current) >= steps.indexOf("types") && (
          <>
            <BotBubble>Which type(s) best describe your business?</BotBubble>
            {current === "types" ? (
              <YouBubble active>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() =>
                        setTypes((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        )
                      }
                      className={clsx(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        types.includes(t)
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </YouBubble>
            ) : (
              types.length > 0 && <YouBubble>{types.join(", ")}</YouBubble>
            )}
          </>
        )}

        {/* LINKS */}
        {steps.indexOf(current) >= steps.indexOf("links") && (
          <>
            <BotBubble>Do you have any website or social links?</BotBubble>
            {current === "links" ? (
              <YouBubble active>
                <div className="flex flex-col gap-2 w-full">
                  {links.map((l, i) => (
                    <input
                      key={i}
                      type="url"
                      value={l}
                      placeholder="https://example.com"
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[i] = e.target.value;
                        setLinks(newLinks);
                      }}
                      className="w-full bg-transparent outline-none border-b border-blue-300 focus:border-purple-500 placeholder-blue-300"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setLinks([...links, ""])}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    + Add another
                  </button>
                </div>
              </YouBubble>
            ) : (
              links.filter((l) => l.trim()).length > 0 && (
                <YouBubble>{links.filter((l) => l.trim()).join(", ")}</YouBubble>
              )
            )}
          </>
        )}

        {/* IMAGES */}
        {steps.indexOf(current) >= steps.indexOf("images") && (
          <>
            <BotBubble>Upload some images (logo, products, etc.)</BotBubble>
            {current === "images" ? (
              <YouBubble active>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="text-white"
                />
              </YouBubble>
            ) : (
              imageUrls.length > 0 && (
                <YouBubble><span className="text-white">{`${imageUrls.length} image(s) uploaded`}</span></YouBubble>
              )
            )}
          </>
        )}

        {/* REVIEW */}
        {current === "review" && (
          <>
            <BotBubble>Here's what we'll save. Looks good?</BotBubble>
            <YouBubble>
              <div className="text-sm space-y-1 text-white">
                <Row label="Org"><span className="text-white">{org}</span></Row>
                <Row label="Email"><span className="text-white">{email}</span></Row>
                <Row label="Phone"><span className="text-white">{phone}</span></Row>
                <Row label="Types"><span className="text-white">{types.join(", ")}</span></Row>
                <Row label="Links"><span className="text-white">{links.join(", ")}</span></Row>
                <Row label="Images"><span className="text-white">{imageUrls.length > 0 ? "Yes" : "No"}</span></Row>
              </div>
            </YouBubble>
          </>
        )}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-2 border-t border-blue-200 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={prev}
          disabled={current === "org"}
          className="rounded-xl border border-blue-300 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-40 transition-colors"
        >
          ◀ Back
        </button>

        {current !== "review" ? (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className={clsx(
              "rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow",
              canContinue 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" 
                : "bg-blue-100 text-blue-400"
            )}
          >
            {labelForNext(current)}
          </button>
        ) : (
          <button
            type="button"
            onClick={saveToSupabase}
            disabled={saving}
            className={clsx(
              "rounded-xl px-5 py-2 text-sm font-semibold transition-all shadow",
              saving 
                ? "bg-blue-100 text-blue-400" 
                : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
            )}
          >
            {saving ? "Saving…" : (existingData ? "Update Profile" : "Save")}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={clsx(
            "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-sm shadow-lg transition-opacity",
            toast.type === "ok" 
              ? "bg-gradient-to-r from-green-600 to-blue-600 text-white" 
              : "bg-gradient-to-r from-red-500 to-purple-600 text-white"
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ---------- UI helpers ----------
function BotBubble({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white grid place-items-center shadow">💬</div>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl border px-4 py-3 text-sm shadow-sm",
          highlight 
            ? "border-purple-300 bg-gradient-to-b from-white to-blue-50" 
            : "border-blue-200 bg-gradient-to-b from-white to-blue-50"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function YouBubble({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div className="flex w-full justify-end">
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
          active 
            ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white/90"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
  <div className="w-28 shrink-0 font-medium text-white">{label}:</div>
      <div className="flex-1 text-blue-800">{children}</div>
    </div>
  );
}

function labelForNext(step: StepKey) {
  switch (step) {
    case "org":
      return "Next: Email";
    case "email":
      return "Next: Phone";
    case "phone":
      return "Next: Business Type";
    case "types":
      return "Next: Links";
    case "links":
      return "Next: Images";
    case "images":
      return "Review";
    default:
      return "Next";
  }
}

function isValidURL(s: string) {
  try {
    const u = new URL(s);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}