"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BusinessLoaderClient({ userId, profile }: any) {
  const router = useRouter();

  useEffect(() => {
    // simulate a short loading experience before redirect
    const timer = setTimeout(() => {
      router.push("/BusinessForm");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-100 to-emerald-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white text-center animate-pulse">
        <h1 className="text-2xl font-bold text-emerald-700">
          Welcome {profile?.full_name ?? "Business User"} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Preparing your business dashboard...
          <br /> Please wait a moment.
        </p>
        <div className="mt-6 w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
