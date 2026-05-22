import type { NextConfig } from "next";

const rawBackendOrigin =
  process.env.BACKEND_ORIGIN ||
  process.env.BACKEND_URL ||
  "http://localhost:3001";

const normalizedBackendOrigin = (() => {
  if (!rawBackendOrigin) return "http://localhost:3001";
  const trimmed = rawBackendOrigin.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }
  // Assume https for bare domains (e.g., admin.example.com)
  return `https://${trimmed.replace(/\/$/, "")}`;
})();

const backendOrigin = normalizedBackendOrigin;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1",
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
// update next to 13.4.4 to fix "Error: error:0308010C:digital envelope routines::unsupported" on M1/M2 Macs with Node 18+ (