import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/',
      destination: '/dashboard',
      permanent: true,
    },
  ],
  // output: 'standalone',
};

export default nextConfig;
