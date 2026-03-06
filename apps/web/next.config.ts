import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  redirects: async () => [
    {
      source: "/work",
      destination: "/",
      permanent: true,
    },
  ],

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
