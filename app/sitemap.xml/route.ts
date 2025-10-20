import { NextResponse } from "next/server"
import { blogPosts } from "@/lib/blog-data"

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : origin))

  const currentDate = new Date().toISOString()
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/try/zyfoox', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
    { url: '/LearnFlow', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
    { url: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/products', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/showcase', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/waitlist', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
    { url: '/dashboard', priority: '0.5', changefreq: 'weekly', lastmod: currentDate },
    { url: '/press', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/docs', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/playground', priority: '0.7', changefreq: 'weekly', lastmod: currentDate },
    { url: '/passport', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/terms', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/disclaimer', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/LearnFlowprivacypolicy', priority: '0.4', changefreq: 'yearly', lastmod: currentDate },
  ]

  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.publishedAt
  }))

  const pressPages = [
    { url: '/press/1', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/press/2', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/press/3', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
  ]

  const allPages = [...staticPages, ...blogPages, ...pressPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  })
}