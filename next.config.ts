import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"],
  },
  productionBrowserSourceMaps: false,
  turbopack: {},
};

export default nextConfig;
