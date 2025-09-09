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

type BusinessProfile = {
  id: string;
  org_name: string;
  email: string;
  phone: string;
  business_types: string[];
  links: string[];
  images: string[];
};

export default function BusinessFormPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfileAndBusinessData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Get user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Check if business profile exists - handle case where no profile exists
        const { data: businessData, error } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle no rows

        if (error) {
          console.error("Error fetching business profile:", error);
          setBusinessProfile(null);
        } else {
          setBusinessProfile(businessData);
        }
      }

      setLoading(false);
    };

    getProfileAndBusinessData();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getProfileAndBusinessData();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <p className="text-blue-700">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="rounded-xl bg-white p-6 shadow-md text-center border border-blue-200">
          <h1 className="text-xl font-semibold text-purple-600">Not Logged In</h1>
          <p className="text-sm text-blue-600 mt-2">
            Please sign in to continue using the Business Registration form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Header isEdit={!!businessProfile} />
        <ClientChatForm
          userId={profile.id}
          defaultEmail={profile.email ?? ""}
          defaultName={profile.full_name ?? ""}
          existingData={businessProfile}
        />
      </div>
    </div>
  );
}

function Header({ isEdit }: { isEdit: boolean }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white grid place-items-center shadow-md">
        <span className="text-xl">💼</span>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEdit ? "Edit Business Profile" : "Business Registration"} – Chat Form
        </h1>
        <p className="text-sm text-blue-700">
          {isEdit ? "Update your business information." : "Answer a few quick questions. Your data is securely stored in Supabase."}
        </p>
      </div>
    </div>
  );
}