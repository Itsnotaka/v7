import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  cacheComponents: true,
  reactCompiler: true,
};

export default nextConfig;
