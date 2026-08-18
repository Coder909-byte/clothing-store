import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images during development
      { protocol: 'https', hostname: 'placehold.co' },
      // Pexels stock images
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'www.pexels.com' },
      // Cloudinary CDN (real assets)
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Make NEXT_PUBLIC_ vars explicit for type safety
  env: {
    NEXT_PUBLIC_MEDUSA_URL: process.env.NEXT_PUBLIC_MEDUSA_URL ?? 'http://localhost:9000',
    NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
    NEXT_PUBLIC_DEFAULT_REGION: process.env.NEXT_PUBLIC_DEFAULT_REGION ?? 'in',
  },
}

export default nextConfig