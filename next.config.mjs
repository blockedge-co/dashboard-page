/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimizations
  swcMinify: true,
  compress: true,
  
  // Production-ready error handling
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Image optimization - keep unoptimized for flexibility as per project config
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    domains: ['asset.blockedge.co', 'exp.co2e.cc'],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    scrollRestoration: true,
  },
  
  // Bundle analysis
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    // Performance optimizations
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://asset.blockedge.co https://exp.co2e.cc;",
          },
        ],
      },
    ];
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/dashboard/:path*',
        has: [
          {
            type: 'host',
            value: 'blockedge.co',
          },
        ],
        destination: 'https://dashboard.blockedge.co/:path*',
        permanent: true,
      },
    ];
  },
  
  // Environment-specific configurations
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
  },
  
  // Output optimizations
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
