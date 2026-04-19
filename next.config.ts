import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "20mb",
  },
  async rewrites() {
    return [
      // 이미지 업로드는 Next.js proxy를 거치지 않고 직접 백엔드로 rewrite
      {
        source: "/upload/profile-image",
        destination: `${process.env.BACKEND_URL}/api/auth/me/profile-image`,
      },
      {
        source: "/upload/notes/:noteId/images",
        destination: `${process.env.BACKEND_URL}/api/notes/:noteId/images`,
      },
    ];
  },
};

export default nextConfig;
