import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/',
      destination: '/dashboard',
      permanent: true,
    },
  ],
  webpack: (config) => {
    //https://dev.to/dinhkhai0201/module-not-found-cant-resolve-pino-pretty-g6
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
  // output: 'standalone',
};

export default nextConfig;
