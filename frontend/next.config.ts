import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // If you use external images, configure domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Compression for smaller bundle sizes
  compress: true,

  // Configure Turbopack for hot reloading in Docker (Next.js 16+)
  turbopack: {
    // Empty config to silence the warning
    // Turbopack handles hot reloading automatically in Docker
  },

  // Security headers (optional but recommended)
};

export default nextConfig;
