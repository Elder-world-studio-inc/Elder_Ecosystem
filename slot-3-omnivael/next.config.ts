import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Forced rebuild trigger
  output: 'standalone',
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "api.omnivael.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
