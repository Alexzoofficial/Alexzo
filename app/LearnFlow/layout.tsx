import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LearnFlow 2.0 - AI-Powered Learning Platform | Download Free App | Alexzo",
  description: "Download LearnFlow 2.0, the revolutionary AI-powered learning platform with advanced personalization, adaptive content delivery, and intelligent progress tracking. Join 75K+ learners experiencing the future of education. Free download available for Android, iOS, Windows, macOS.",
  keywords: "LearnFlow 2.0, AI learning app, personalized education, adaptive learning platform, AI tutoring, smart learning paths, educational technology, AI education app, learning analytics, cognitive enhancement, educational AI, mobile learning app, free learning app, download LearnFlow",
  authors: [{ name: "Alexzo Team" }],
  creator: "Alexzo",
  publisher: "Alexzo",
  category: "Education",
  openGraph: {
    title: "LearnFlow 2.0 - AI-Powered Learning Platform | Download Free App",
    description: "Revolutionary AI-powered learning platform with advanced personalization and adaptive content delivery. Join 75K+ learners. Free download available.",
    url: "https://alexzo.vercel.app/LearnFlow",
    siteName: "Alexzo",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LearnFlowappicon-QFniHopMadVw2rtAO02r8r8itI17Fz.png",
        width: 1200,
        height: 630,
        alt: "LearnFlow 2.0 - AI-Powered Learning Platform App Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFlow 2.0 - AI-Powered Learning Platform | Download Free App",
    description: "Revolutionary AI-powered learning platform with advanced personalization. Join 75K+ learners experiencing the future of education.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LearnFlowappicon-QFniHopMadVw2rtAO02r8r8itI17Fz.png"],
    creator: "@alexzo",
  },
  alternates: {
    canonical: "https://alexzo.vercel.app/LearnFlow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function LearnFlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}