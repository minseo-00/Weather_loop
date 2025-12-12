import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
        pathname: "/img/wn/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:3001/auth/:path*',
      },
      // Proxy only the backend weather API so frontend /api/* routes remain served by Next.js
      {
        source: '/api/weather',
        destination: 'http://127.0.0.1:3001/api/weather',
      },
    ];
  },
};

export default nextConfig;
