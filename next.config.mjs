/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // Base path for your cloud deployment
  basePath: '/app/stock',
  assetPrefix: '/app/stock',
  

  // API routes configuration
  async rewrites() {
    return [
      // Optional: Add API versioning or custom routes if needed
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
      // Handle cloud deployment path
      {
        source: '/app/stock',
        destination: '/',
        permanent: false,
      },
    ];
  },
  // Environment variables for API configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Image optimization for product images
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
