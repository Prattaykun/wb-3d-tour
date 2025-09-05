"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/server";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
    const full_name = (formData.get("full_name") as string) || "";
    const role = localStorage.getItem("role");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      await supabase.rpc("create_profiles_table_if_not_exists");
     await supabase.from("profiles").insert({
      id: userId,
       full_name,
      email,
      role,  
      created_at: new Date().toISOString(),
      });

    }
    router.push("/auth/confirmEmail");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/40 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative w-full max-w-md">
        <form
          onSubmit={handleSignup}
          className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/media/flight.png"
                alt="App Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Create Account ✨
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Fill in your details to get started
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                required
              />
            </div>

            {/* Password with eye toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-lg"
            >
              Sign Up
            </button>
          </div>

          {/* Switch to Login */}
          <div className="flex justify-center items-center mt-6 text-sm text-gray-500">
            <span>Already have an account?</span>
            <button
              type="button"
              className="ml-2 font-medium text-indigo-600 hover:underline"
              onClick={() => router.push("/auth/login")}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
