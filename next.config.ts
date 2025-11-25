import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 开启输出独立目录，方便部署
  output: 'standalone',

  // 禁用严格模式（可选）
  reactStrictMode: false,
  
  // 优化配置
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
