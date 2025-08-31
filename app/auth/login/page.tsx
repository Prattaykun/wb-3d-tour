"use client";

import { supabase } from '@/utils/supabase/server';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      router.push("/"); // redirect after login
    }
  };

  return (
<div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
  {/* Create Account Button BELOW the form */}
        <button
          type="button"
          className="w-80 mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/auth/role")}
        >
          Create an account
        </button>
    </div>
  );
}
