"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BusinessLoaderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Checking your business profile...");

  useEffect(() => {
    const checkBusinessProfile = async () => {
      try {
        // Get user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push("/auth/login");
          return;
        }

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          router.push("/auth/login");
          return;
        }

        // Role check
        const role = (profile.role ?? "").toLowerCase();
        if (role !== "business" && role !== "admin") {
          router.push("/");
          return;
        }

        // Check if business profile exists
        const { data: businessProfile, error: businessError } = await supabase
          .from("business_profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (businessError) {
          // No business profile found
          setMessage("Redirecting to business form...");
          setTimeout(() => {
            router.push("/BusinessForm");
          }, 2000);
        } else {
          // Business profile exists
          setMessage("Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/BusinessDashboard");
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking business profile:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkBusinessProfile();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-100 to-emerald-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white text-center">
        <h1 className="text-2xl font-bold text-emerald-700">
          Welcome Business User 👋
        </h1>
        <p className="mt-2 text-gray-600">
          {message}
          <br /> Please wait a moment.
        </p>
        <div className="mt-6 w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}