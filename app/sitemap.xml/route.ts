import { NextResponse } from "next/server"
import { blogPosts } from "@/lib/blog-data"

export async function GET(request: Request) {
  const baseUrl = 'https://alexzo.vercel.app'

  const currentDate = new Date().toISOString()
  
  const imageData = {
    products: [
      { file: 'alexis-ai.png', title: 'Alexis AI Assistant', caption: 'Your intelligent AI assistant for enhanced productivity' },
      { file: 'image-generator.png', title: 'AI Image Generator', caption: 'Generate stunning images with AI technology' },
      { file: 'video-generator.png', title: 'AI Video Generator', caption: 'Create engaging videos with AI' },
      { file: 'zyfoox-interface.png', title: 'Zyfoox Interface', caption: 'Intuitive interface for AI image generation' },
    ],
  }
  
  const staticPages = [
    { 
      url: '', 
      priority: '1.0', 
      changefreq: 'daily', 
      lastmod: currentDate,
      images: [
        { loc: '/logo.png', title: 'Alexzo Logo', caption: 'AI-Powered Human Enhancement Platform' },
        { loc: '/favicon.png', title: 'Alexzo Icon', caption: 'Alexzo platform icon' }
      ]
    },
    { 
      url: '/try/zyfoox', 
      priority: '0.9', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.products.filter(img => img.file.includes('zyfoox')).map(img => ({
        loc: `/images/products/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { 
      url: '/LearnFlow', 
      priority: '0.9', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.products.slice(0, 2).map(img => ({
        loc: `/images/products/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { 
      url: '/blog', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: currentDate
    },
    { 
      url: '/products', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.products.map(img => ({
        loc: `/images/products/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/waitlist', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
    { url: '/docs', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/terms', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/disclaimer', priority: '0.5', changefreq: 'monthly', lastmod: currentDate },
    { url: '/LearnFlowprivacypolicy', priority: '0.4', changefreq: 'yearly', lastmod: currentDate },
  ]

  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.id}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.publishedAt,
    images: []
  }))

  const allPages = [...staticPages, ...blogPages]

  const generateImageTags = (images: Array<{ loc: string, title: string, caption: string }>) => {
    if (!images || images.length === 0) return ''
    
    return images.map(img => `
    <image:image>
      <image:loc>${baseUrl}${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('')
  }

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
    <priority>${page.priority}</priority>${generateImageTags(page.images || [])}
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
