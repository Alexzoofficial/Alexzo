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
Sitemap: https://alexzo.vercel.app/sitemap.xml

# Host directive
Host: https://alexzo.vercel.app`

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  })
}
