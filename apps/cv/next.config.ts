import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,

  redirects: async () => [
    {
      source: "/work",
      destination: "/",
      permanent: true,
    },
  ],
};

export default nextConfig;
