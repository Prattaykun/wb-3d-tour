"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="md:hidden fixed top-10 left-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition"
    >
      <ArrowLeft className="w-5 h-5 text-gray-800" />
    </button>
  );
}
