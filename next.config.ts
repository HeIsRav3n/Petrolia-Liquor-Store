import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Using <img> tags directly throughout the app (with eslint-disable comments)
    // This prevents build warnings and supports all image sources
    unoptimized: true,
  },
  // Ensure server-side env vars are available at build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default nextConfig;
