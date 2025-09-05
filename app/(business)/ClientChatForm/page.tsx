"use client";

import { useMemo, useRef, useState } from "react";
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
      const payload = {
        id: userId,
        org_name: org.trim(),
        email: email.trim(),
        phone: phone.trim(),
        business_types: types,
        links: links.filter((l) => l.trim().length > 0),
        images: imageUrls,
      };

      const { error } = await supabaseBrowser.from("business_profiles").insert(payload);
      if (error) throw error;

      setToast({ type: "ok", msg: "Saved successfully! Redirecting…" });
      setTimeout(() => {
        window.location.href = "/";
      }, 900);
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm text-gray-700">
      {/* Chat window */}
      <div ref={scrollerRef} className="max-h-[70vh] overflow-auto p-4 sm:p-6 space-y-4 text-gray-700">
        <BotBubble>Hey! Let’s register your business. I’ll ask a few questions, and then we’ll save it.</BotBubble>

        {/* ORG */}
        <BotBubble>What’s your organization name?</BotBubble>
        {current === "org" ? (
          <YouBubble active>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Enter organization name..."
              className="w-full bg-transparent outline-none"
            />
          </YouBubble>
        ) : org && <YouBubble>{org}</YouBubble>}

        {/* EMAIL */}
        {current !== "org" && (
          <>
            <BotBubble>What’s your business email?</BotBubble>
            {current === "email" ? (
              <YouBubble active>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="w-full bg-transparent outline-none"
                />
              </YouBubble>
            ) : email && <YouBubble>{email}</YouBubble>}
          </>
        )}

        {/* PHONE */}
        {steps.indexOf(current) >= steps.indexOf("phone") && (
          <>
            <BotBubble>What’s your contact number?</BotBubble>
            {current === "phone" ? (
              <YouBubble active>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone..."
                  className="w-full bg-transparent outline-none"
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
                        "px-3 py-1 rounded-full text-sm",
                        types.includes(t)
                          ? "bg-black text-white"
                          : "bg-stone-200 text-gray-700"
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
                      className="w-full bg-transparent outline-none border-b border-stone-300"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setLinks([...links, ""])}
                    className="text-xs text-blue-600"
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
                />
              </YouBubble>
            ) : (
              imageUrls.length > 0 && (
                <YouBubble>{`${imageUrls.length} image(s) uploaded`}</YouBubble>
              )
            )}
          </>
        )}

        {/* REVIEW */}
        {current === "review" && (
          <>
            <BotBubble>Here’s what we’ll save. Looks good?</BotBubble>
            <YouBubble>
              <div className="text-sm space-y-1">
                <Row label="Org">{org}</Row>
                <Row label="Email">{email}</Row>
                <Row label="Phone">{phone}</Row>
                <Row label="Types">{types.join(", ")}</Row>
                <Row label="Links">{links.join(", ")}</Row>
                <Row label="Images">{imageUrls.length} uploaded</Row>
              </div>
            </YouBubble>
          </>
        )}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3 sm:px-6 text-gray-700">
        <button
          type="button"
          onClick={prev}
          disabled={current === "org"}
          className="rounded-xl border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50 disabled:opacity-40"
        >
          ◀ Back
        </button>

        {current !== "review" ? (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className={clsx(
              "rounded-xl px-5 py-2 text-sm font-semibold transition shadow",
              canContinue ? "bg-black text-white hover:brightness-110" : "bg-stone-300 text-stone-600"
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
              "rounded-xl px-5 py-2 text-sm font-semibold transition shadow",
              saving ? "bg-stone-300 text-stone-600" : "bg-black text-white hover:brightness-110"
            )}
          >
            {saving ? "Saving…" : "Save to Supabase"}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={clsx(
            "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-sm shadow-lg",
            toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
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
      <div className="h-9 w-9 shrink-0 rounded-2xl bg-black text-white grid place-items-center shadow">💬</div>
      <div
        className={clsx(
          "max-w-[80%] rounded-2xl border px-4 py-3 text-sm shadow-sm",
          highlight ? "border-black bg-white" : "border-stone-200 bg-white"
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
          active ? "bg-stone-900 text-white" : "bg-stone-800 text-white/90"
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
      <div className="w-28 shrink-0 font-medium">{label}:</div>
      <div className="flex-1">{children}</div>
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
