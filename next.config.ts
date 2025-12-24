import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  productionBrowserSourceMaps: false,
  turbopack: {},
};

export default nextConfig;
