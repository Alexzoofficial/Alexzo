/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    allowedDevOrigins: ['127.0.0.1', 'localhost', '7fa1e16f-4a7c-4a2e-8c72-8c28437f0f0f-00-99wefa0w47vy.sisko.replit.dev', '*.replit.dev', '127.0.0.1:5000', 'localhost:5000'],
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://7fa1e16f-4a7c-4a2e-8c72-8c28437f0f0f-00-99wefa0w47vy.sisko.replit.dev',
  },
}

export default nextConfig
