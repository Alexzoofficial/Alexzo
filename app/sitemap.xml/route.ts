import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the current domain from request
  const { origin } = new URL(request.url)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : origin)

  const currentDate = new Date().toISOString()
  
  // All pages with their metadata
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/try/zyfoox', priority: '0.9', changefreq: 'weekly' },
    { url: '/LearnFlow', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog/1', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/2', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/3', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/4', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/5', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/6', priority: '0.7', changefreq: 'monthly' },
    { url: '/products', priority: '0.8', changefreq: 'weekly' },
    { url: '/showcase', priority: '0.7', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/waitlist', priority: '0.6', changefreq: 'weekly' },
    { url: '/dashboard', priority: '0.5', changefreq: 'weekly' },
    { url: '/press', priority: '0.6', changefreq: 'monthly' },
    { url: '/docs', priority: '0.6', changefreq: 'monthly' },
    { url: '/playground', priority: '0.5', changefreq: 'weekly' },
    { url: '/passport', priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
    { url: '/terms', priority: '0.5', changefreq: 'monthly' },
    { url: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
    { url: '/LearnFlowprivacypolicy', priority: '0.4', changefreq: 'yearly' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      "X-Robots-Tag": "noindex",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  })
}