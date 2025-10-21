// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // 👈 where the service worker & manifest will be generated
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable PWA in dev mode
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // accept all image hosts
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
}

module.exports = withPWA(nextConfig)
