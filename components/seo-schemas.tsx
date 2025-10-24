"use client"

import Script from "next/script"
import { getSiteUrl } from "@/lib/site-url"

/**
 * FAQ Schema Component for SEO
 * Ye Google Search mein FAQ rich snippets dikhane ke liye
 */
export function FAQSchema() {
  const siteUrl = getSiteUrl()
  
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Zyfoox AI image generator completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Zyfoox AI image generator is 100% free to use. You can create unlimited AI-generated images without any credit card or payment required. Simply sign up and start creating stunning images instantly with our advanced AI technology."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI image generator work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zyfoox uses advanced neural networks and deep learning algorithms to transform your text descriptions into high-quality images. Simply type what you want to create, and our AI will generate professional images in seconds. The technology leverages state-of-the-art generative AI models trained on millions of images."
        }
      },
      {
        "@type": "Question",
        "name": "What is LearnFlow 2.0?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LearnFlow 2.0 is a revolutionary AI-powered learning platform that personalizes education for every user. It features adaptive content delivery, intelligent progress tracking, and AI-driven personalized learning paths. The app is available free for Android, iOS, Windows, and macOS with over 75,000 active learners."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the generated images for commercial purposes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, images generated with Zyfoox can be used for both personal and commercial projects. You retain full rights to your creations. Our AI image generator is designed for professionals, businesses, content creators, and anyone who needs high-quality visuals."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to download any software to use Alexzo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No download required for Zyfoox AI image generator - it runs directly in your web browser. LearnFlow 2.0 learning platform is available as a downloadable app for mobile and desktop devices. Both tools are optimized for ease of use and accessibility."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Alexzo different from other AI platforms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alexzo combines powerful AI image generation with advanced learning technology in one platform. We offer completely free access to cutting-edge AI tools, focus on user experience, and provide both creative and educational solutions. With 75K+ satisfied users, we're committed to democratizing AI technology."
        }
      }
    ]
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      strategy="afterInteractive"
    />
  )
}

/**
 * Breadcrumb Schema for better navigation in search results
 */
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const siteUrl = getSiteUrl()
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      strategy="afterInteractive"
    />
  )
}

/**
 * VideoObject Schema for product demos and tutorials
 */
export function VideoSchema({ 
  name, 
  description, 
  thumbnailUrl, 
  uploadDate,
  duration 
}: { 
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
}) {
  const siteUrl = getSiteUrl()
  
  const videoData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": `${siteUrl}${thumbnailUrl}`,
    "uploadDate": uploadDate,
    "duration": duration || "PT2M",
    "contentUrl": siteUrl,
    "embedUrl": siteUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Alexzo",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  }

  return (
    <Script
      id="video-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoData) }}
      strategy="afterInteractive"
    />
  )
}

/**
 * HowTo Schema for tutorials and guides
 */
export function HowToSchema() {
  const siteUrl = getSiteUrl()
  
  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate AI Images with Zyfoox",
    "description": "Step-by-step guide to creating stunning AI-generated images using Zyfoox AI image generator",
    "image": `${siteUrl}/images/products/zyfoox-interface.png`,
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Sign Up for Free",
        "text": "Create a free account on Alexzo platform. No credit card required.",
        "url": `${siteUrl}/auth`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Access Zyfoox AI Generator",
        "text": "Navigate to the Zyfoox AI image generator tool from your dashboard.",
        "url": `${siteUrl}/try/zyfoox`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Describe Your Image",
        "text": "Enter a detailed text description of the image you want to create. Be specific about style, colors, and elements.",
        "url": `${siteUrl}/try/zyfoox`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Generate and Download",
        "text": "Click generate and watch as AI creates your image in seconds. Download and use it anywhere.",
        "url": `${siteUrl}/try/zyfoox`
      }
    ]
  }

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
      strategy="afterInteractive"
    />
  )
}
