import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"], // ✅ Fix for "export *" issue
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ✅ Required for static export with <Image />
    domains: ["zjzritpuuijofnxflghd.supabase.co"],
  },
};

export default nextConfig;
