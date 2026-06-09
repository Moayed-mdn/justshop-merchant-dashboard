import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['laratenant.local', '*.laratenant.local'],
  // Turbopack disabled due to routing issues with route groups + dynamic segments
  // See: https://github.com/vercel/next.js/issues/...
  // turbopack: {
  //   root: process.cwd(),
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
