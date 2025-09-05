"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BusinessLoaderClient from "./BusinessLoaderClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BusinessLoaderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      // ✅ Get user session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);

      // ✅ Get profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, full_name, email")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        router.push("/auth/login");
        return;
      }

      // ✅ Role check
      const role = (profile.role ?? "").toLowerCase();
      if (role !== "business" && role !== "admin") {
        router.push("/");
        return;
      }

      // ✅ Check business profile
      const { data: businessProfile } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (businessProfile) {
        // 🚀 already has business profile → dashboard
        router.push("/BusinessDashboard");
      } else {
        // 🚀 no business profile → business form
        setProfile(profile); // save profile for client
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
  // Show BusinessLoaderClient with a safe placeholder
  return (
    <BusinessLoaderClient
      userId={userId ?? "loading"}
      profile={profile ?? { full_name: "Business User" }}
    />
  );
}



}
