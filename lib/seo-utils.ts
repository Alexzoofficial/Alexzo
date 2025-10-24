import type { Metadata } from "next"
import { getSiteUrl } from "./site-url"

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
  const baseUrl = getSiteUrl()
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
