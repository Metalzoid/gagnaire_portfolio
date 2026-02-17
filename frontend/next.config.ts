import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

// URL interne du backend (Docker: http://backend:3001, local: http://localhost:3001)
const BACKEND_INTERNAL =
  process.env.API_URL_INTERNAL || "http://localhost:3001";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Évite les erreurs "No link element found for chunk" avec les CSS modules (not-found, etc.)
    cssChunking: "strict",
  },
  // Proxy /api et /uploads vers le backend (nécessaire quand seul le frontend est exposé, ex. Coolify)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_INTERNAL}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_INTERNAL}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
