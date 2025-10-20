import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : origin))

  const robots = `# Robots.txt for Alexzo - AI-Powered Human Enhancement Platform
# Public content is welcome to be indexed by search engines

User-agent: *
Allow: /
Disallow: /api/keys
Disallow: /api/user/delete
Disallow: /api/custom-apis
Disallow: /dashboard

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

# Social media crawlers
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

# Allow public assets
Allow: /_next/static/
Allow: /images/
Allow: /favicon.ico
Allow: /logo.png
Allow: /manifest.json

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host directive
Host: ${baseUrl}`

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  })
}
