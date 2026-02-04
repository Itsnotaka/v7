/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  cacheComponents: true,
  reactCompiler: true,
};

export default nextConfig;
