import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.31.136'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.sherucon.tech",
      },
    ],
  },
};

export default nextConfig;
