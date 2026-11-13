import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e4fd09lc"}/${process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}/**`,
      },
    ],
  },
};

export default nextConfig;
