import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  reactStrictMode: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
