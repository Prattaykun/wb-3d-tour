import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["framer-motion"], // ✅ Fix for "export *" issue
   ignoreDuringBuilds: true,
};

export default nextConfig;
