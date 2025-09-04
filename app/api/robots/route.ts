import { NextResponse } from "next/server"

export async function GET() {
  const robots = `# Robots.txt for Alexzo - AI-Powered Human Enhancement Platform
# All crawlers are welcome to index our content

User-agent: *
Allow: /

# Specific permissions for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 2

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# Allow all API endpoints for proper functionality
Allow: /api/
Allow: /_next/
Allow: /images/
Allow: /favicon.ico
Allow: /logo.png

# Sitemap location
Sitemap: https://${process.env.REPLIT_DEV_DOMAIN || 'ee5e1e02-69c2-49a7-8ca8-603791810cd6-00-2gww905z29zg0.sisko.replit.dev'}/sitemap.xml

# Host directive
Host: https://${process.env.REPLIT_DEV_DOMAIN || 'ee5e1e02-69c2-49a7-8ca8-603791810cd6-00-2gww905z29zg0.sisko.replit.dev'}`

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  })
}
