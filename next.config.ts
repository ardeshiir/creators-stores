import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TODO: change this later for now using ** to accept the mock data that is set in the backend
  images: {
    remotePatterns: [
      {
        protocol: 'https', // You can specify the protocol if needed
        hostname: '**', // This allows any hostname
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output: 'standalone',
}

export default nextConfig
