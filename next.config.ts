import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["playwright", "playwright-core"],
  // Playwright loads its browser manifest/protocol dynamically; standalone tracing misses them.
  outputFileTracingIncludes: {
    "/api/douyin": [
      "./node_modules/.pnpm/playwright@*/node_modules/playwright/**",
      "./node_modules/.pnpm/playwright-core@*/node_modules/playwright-core/**",
    ],
  },

  allowedDevOrigins: ["127.0.0.1"],

  reactStrictMode: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
