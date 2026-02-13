import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Évite les erreurs "No link element found for chunk" avec les CSS modules (not-found, etc.)
    cssChunking: "strict",
  },
};

export default nextConfig;
