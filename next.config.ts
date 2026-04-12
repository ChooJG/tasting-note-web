import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.124.79.235:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
