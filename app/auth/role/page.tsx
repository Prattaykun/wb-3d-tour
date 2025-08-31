"use client";

import { useRouter } from "next/navigation";

export default function RolePage() {
  const router = useRouter();

  const handleSelect = (role: string) => {
    // Save to cookie for middleware + localStorage for client access
    document.cookie = `role=${role}; path=/; max-age=3600`; 
    localStorage.setItem("role", role);
    router.push("/auth/signup");
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        onClick={() => handleSelect("consumer")}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold cursor-pointer hover:opacity-90 transition"
      >
        Consumer
      </div>
      <div
        onClick={() => handleSelect("business")}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 text-white text-3xl font-bold cursor-pointer hover:opacity-90 transition"
      >
        Business
      </div>
    </div>
  );
}
