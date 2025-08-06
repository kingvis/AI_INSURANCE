import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during builds for Vercel deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow TypeScript type checking to continue
    ignoreBuildErrors: false,
  },
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  // Remove deprecated and invalid properties
};

export default nextConfig;
