// app/(business)/BusinessForm/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import ClientChatForm from "./ClientChatForm"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export default function BusinessFormPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
        }
      }

      setLoading(false);
    };

    getProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="rounded-xl bg-white p-6 shadow-md text-center">
          <h1 className="text-xl font-semibold text-red-600">Not Logged In</h1>
          <p className="text-sm text-gray-600 mt-2">
            Please sign in to continue using the Business Registration form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Header />
        <ClientChatForm
          userId={profile.id}
          defaultEmail={profile.email ?? ""}
          defaultName={profile.full_name ?? ""}
        />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-black text-white grid place-items-center shadow-md">
        <span className="text-xl">ℹ️</span>
      </div>
      <div>
  <h1 className="text-2xl font-semibold tracking-tight text-gray-700">
          Business Registration – Chat Form
        </h1>
        <p className="text-sm text-stone-600">
          Answer a few quick questions. Your data is securely stored in Supabase.
        </p>
      </div>
    </div>
  );
}
