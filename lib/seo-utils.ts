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
  const baseUrl = "https://alexzo.vercel.app"
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const imageUrl = image ? `${baseUrl}${image}` : `https://alexzo.vercel.app/logo.png`

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
