/** @type {import('next').NextConfig} */
const replitDomain = process.env.REPLIT_DEV_DOMAIN;
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    allowedDevOrigins: [
      '127.0.0.1', 
      'localhost', 
      '*.replit.dev',
      '127.0.0.1:5000', 
      'localhost:5000',
      ...(replitDomain ? [replitDomain, `${replitDomain}:5000`] : [])
    ],
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
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || (replitDomain ? `https://${replitDomain}` : 'http://localhost:5000'),
  },
}

export default nextConfig
