import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "om32oh4l85.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
