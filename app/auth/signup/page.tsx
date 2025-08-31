"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/utils/supabase/server';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      router.replace("/auth/role"); // Redirect if role not selected
    }
  }, [router]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const full_name = formData.get("full_name") as string || "";
    const role = localStorage.getItem("role");

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Insert profile into public.profiles
    const userId = data?.user?.id;
    if (userId) {
      // Create table if not exists (run only once, ideally in migration, but for demo can run here)
      await supabase.rpc('create_profiles_table_if_not_exists');
      await supabase.from('profiles').insert({
        id: userId,
        full_name,
        email,
        created_at: new Date().toISOString(),
      });
    }
    router.push("/auth/confirmEmail");
  };

  return (
<div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
      <button
        type="button"
        className="w-center mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        onClick={() => router.push("/auth/login")}
      >
        Log in to an existing account
      </button>
    </div>
  );
}
