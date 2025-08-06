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
  experimental: {
    // Enable modern features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
