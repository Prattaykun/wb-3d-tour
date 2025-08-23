import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["framer-motion"], // ✅ Fix for "export *" issue
};

export default nextConfig;
