import { NextResponse } from "next/server"
import { blogPosts } from "@/lib/blog-data"

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : origin))

  const currentDate = new Date().toISOString()
  
  // All images with metadata for SEO
  const imageData = {
    blog: [
      { file: 'ai-accessibility.png', title: 'AI Accessibility Features', caption: 'Making AI technology accessible to everyone' },
      { file: 'ai-cognitive-enhancement.png', title: 'AI Cognitive Enhancement', caption: 'Enhance your cognitive abilities with AI' },
      { file: 'ai-image-generation-tech.jpg', title: 'AI Image Generation Technology', caption: 'Advanced AI image generation technology' },
      { file: 'ai-image-generation.png', title: 'AI Image Generation', caption: 'Create stunning images with AI' },
      { file: 'alexzo-ai-revolution.jpg', title: 'Alexzo AI Revolution', caption: 'Revolutionizing human enhancement with AI' },
      { file: 'learnflow-2.0.png', title: 'LearnFlow 2.0', caption: 'Next generation adaptive learning platform' },
      { file: 'learnflow-education.jpg', title: 'LearnFlow Education', caption: 'Personalized education powered by AI' },
      { file: 'neural-networks.png', title: 'Neural Networks', caption: 'Advanced neural network architecture' },
      { file: 'zyfoox-community.png', title: 'Zyfoox Community', caption: 'Join the Zyfoox AI creator community' },
      { file: 'zyfoox-comprehensive.png', title: 'Zyfoox Comprehensive Features', caption: 'Complete AI image generation toolkit' },
      { file: 'zyfoox-examples.png', title: 'Zyfoox Examples', caption: 'Amazing creations made with Zyfoox AI' },
      { file: 'zyfoox-features.png', title: 'Zyfoox Features', caption: 'Powerful AI image generation features' },
      { file: 'zyfoox-hero.png', title: 'Zyfoox AI Generator', caption: 'Transform ideas into stunning visuals' },
      { file: 'zyfoox-impact.png', title: 'Zyfoox Impact', caption: 'The impact of AI on creativity' },
      { file: 'zyfoox-marketing.png', title: 'Zyfoox Marketing', caption: 'AI-powered marketing content creation' },
      { file: 'zyfoox-seo.png', title: 'Zyfoox SEO', caption: 'Optimize your content with AI-generated images' },
      { file: 'zyfoox-technology.png', title: 'Zyfoox Technology', caption: 'Cutting-edge AI technology behind Zyfoox' },
    ],
    products: [
      { file: 'alexis-ai.png', title: 'Alexis AI Assistant', caption: 'Your intelligent AI assistant for enhanced productivity' },
      { file: 'image-generator.png', title: 'AI Image Generator', caption: 'Generate stunning images with AI technology' },
      { file: 'video-generator.png', title: 'AI Video Generator', caption: 'Create engaging videos with AI' },
      { file: 'zyfoox-interface.png', title: 'Zyfoox Interface', caption: 'Intuitive interface for AI image generation' },
    ],
    press: [
      { file: 'ai-breakthrough.png', title: 'AI Breakthrough Announcement', caption: 'Latest AI technology breakthrough' },
      { file: 'partnership.png', title: 'Strategic Partnership', caption: 'New partnerships in AI innovation' },
      { file: 'series-a-funding.png', title: 'Series A Funding', caption: 'Funding announcement for AI platform growth' },
    ],
    showcase: [
      { file: 'ai-interface.png', title: 'AI Interface Showcase', caption: 'Modern AI interface design' },
      { file: 'alexis-ai-demo.png', title: 'Alexis AI Demo', caption: 'Live demonstration of Alexis AI capabilities' },
      { file: 'neural-analysis.png', title: 'Neural Analysis', caption: 'Advanced neural network analysis visualization' },
    ],
    avatars: [
      { file: 'user-1.png', title: 'User Avatar 1', caption: 'Alexzo community member avatar' },
      { file: 'user-2.png', title: 'User Avatar 2', caption: 'Alexzo community member avatar' },
      { file: 'user-3.png', title: 'User Avatar 3', caption: 'Alexzo community member avatar' },
      { file: 'user-4.png', title: 'User Avatar 4', caption: 'Alexzo community member avatar' },
      { file: 'user-5.png', title: 'User Avatar 5', caption: 'Alexzo community member avatar' },
    ]
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
      images: imageData.blog.filter(img => img.file.includes('zyfoox')).map(img => ({
        loc: `/images/blog/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { 
      url: '/LearnFlow', 
      priority: '0.9', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.blog.filter(img => img.file.includes('learnflow')).map(img => ({
        loc: `/images/blog/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { 
      url: '/blog', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.blog.map(img => ({
        loc: `/images/blog/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
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
    { 
      url: '/showcase', 
      priority: '0.7', 
      changefreq: 'weekly', 
      lastmod: currentDate,
      images: imageData.showcase.map(img => ({
        loc: `/images/showcase/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: currentDate },
    { url: '/waitlist', priority: '0.6', changefreq: 'weekly', lastmod: currentDate },
    { url: '/dashboard', priority: '0.5', changefreq: 'weekly', lastmod: currentDate },
    { 
      url: '/press', 
      priority: '0.6', 
      changefreq: 'monthly', 
      lastmod: currentDate,
      images: imageData.press.map(img => ({
        loc: `/images/press/${img.file}`,
        title: img.title,
        caption: img.caption
      }))
    },
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
    lastmod: post.publishedAt,
    images: post.image ? [
      { 
        loc: post.image, 
        title: post.title,
        caption: post.excerpt 
      }
    ] : []
  }))

  const pressPages = [
    { 
      url: '/press/1', 
      priority: '0.6', 
      changefreq: 'monthly', 
      lastmod: currentDate,
      images: [{ loc: '/images/press/ai-breakthrough.png', title: 'AI Breakthrough', caption: 'Latest AI technology breakthrough announcement' }]
    },
    { 
      url: '/press/2', 
      priority: '0.6', 
      changefreq: 'monthly', 
      lastmod: currentDate,
      images: [{ loc: '/images/press/partnership.png', title: 'Partnership News', caption: 'Strategic partnerships in AI innovation' }]
    },
    { 
      url: '/press/3', 
      priority: '0.6', 
      changefreq: 'monthly', 
      lastmod: currentDate,
      images: [{ loc: '/images/press/series-a-funding.png', title: 'Funding Announcement', caption: 'Series A funding for platform growth' }]
    },
  ]

  const allPages = [...staticPages, ...blogPages, ...pressPages]

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
