import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const baseUrl = 'https://alexzo.vercel.app'

  const robots = `# Robots.txt for Alexzo - AI-Powered Human Enhancement Platform
# Public content is welcome to be indexed by search engines

User-agent: *
Allow: /
Allow: /api/generate
Allow: /api/custom-apis
Allow: /api/analytics
Allow: /api/contact
Allow: /api/newsletter
Allow: /api/waitlist
Disallow: /api/keys
Disallow: /api/user/delete
Disallow: /api/auth

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

# Social media crawlers for Open Graph and meta tags
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

# Allow public assets and images for indexing
Allow: /_next/static/
Allow: /images/
Allow: /images/products/
Allow: /favicon.ico
Allow: /favicon.png
Allow: /logo.png
Allow: /manifest.json

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Host directive
Host: ${baseUrl}`

  return new NextResponse(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  })
}
