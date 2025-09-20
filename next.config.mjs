/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },

  // Base path for cloud deployment
  basePath: '/app/stock',
  assetPrefix: '/app/stock',

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/category',
        permanent: true,
      },
      {
        source: '/inventory',
        destination: '/stock',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Image optimization for external domains
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Optional: Enable strict mode for React
  reactStrictMode: true,
};

export default nextConfig;
