/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  experimental: {
    optimizePackageImports: ['next/image'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable experimental features that might cause fetchPriority warnings
  swcMinify: true,
};

module.exports = nextConfig; 