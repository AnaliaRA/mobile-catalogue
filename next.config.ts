import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'prueba-tecnica-api-tienda-moviles.onrender.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'prueba-tecnica-api-tienda-moviles.onrender.com',
        pathname: '/images/**',
      },
      // For E2E test fixtures
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@/shared/ui', '@/entities/product', '@/entities/cart'],
  },
};

export default withBundleAnalyzer(nextConfig);
