"use client";

import { useRouter } from "next/navigation";

export default function RolePage() {
  const router = useRouter();

  const handleSelect = (role: string) => {
    document.cookie = `role=${role}; path=/; max-age=3600`;
    localStorage.setItem("role", role);
    router.push("/auth/signup");
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Consumer Half */}
      <div
        onClick={() => handleSelect("consumer")}
        className="relative w-1/2 h-full flex items-center justify-center text-white text-4xl font-bold cursor-pointer hover:opacity-90 transition"
      >
        {/* Background Image */}
        <img
          src="/media/icons/religious.png" // Replace with your image
          alt="Consumer"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/70 to-blue-700/70"></div>
        {/* Text */}
        <span className="z-10">Consumer</span>
      </div>

      {/* Business Half */}
      <div
        onClick={() => handleSelect("business")}
        className="relative w-1/2 h-full flex items-center justify-center text-white text-4xl font-bold cursor-pointer hover:opacity-90 transition"
      >
        {/* Background Image */}
        <img
          src="/media/icons/shopping.png" // Replace with your image
          alt="Business"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/70 to-green-700/70"></div>
        {/* Text */}
        <span className="z-10">Business</span>
      </div>
    </div>
  );
}
