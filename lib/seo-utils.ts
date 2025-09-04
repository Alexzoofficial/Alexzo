import type { Metadata } from "next"

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}: {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
}): Metadata {
  const baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN || 'ee5e1e02-69c2-49a7-8ca8-603791810cd6-00-2gww905z29zg0.sisko.replit.dev'}`
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/logo.png`

  return {
    title,
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      title,
      description,
      type: type as any,
      url: fullUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
