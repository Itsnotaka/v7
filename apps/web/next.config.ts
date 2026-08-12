import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  transpilePackages: ["@v7/ui"],
  async redirects() {
    return [
      {
        source: "/v2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v2/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      {
        source: "/design-system",
        destination: "/",
        permanent: true,
      },
      {
        source: "/experiences/flow",
        destination: "/experiences/interface-projects",
        permanent: true,
      },
    ];
  },
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "om32oh4l85.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
