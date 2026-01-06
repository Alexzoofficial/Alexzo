import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"
import { Analytics } from "@/components/analytics"
import Script from "next/script"
import { Suspense } from "react"
import { getSiteUrl } from "@/lib/site-url"
import { verificationCodes } from "@/lib/verification-codes"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: {
    default: "Alexzo - AI-Powered Human Enhancement Platform | Zyfoox & LearnFlow",
    template: "%s | Alexzo - AI-Powered Platform"
  },
  description:
    "Transform your ideas with cutting-edge AI technology. Create stunning images with Zyfoox AI Generator & master learning with LearnFlow 2.0. Join 75K+ users experiencing the future of AI-powered human enhancement.",
  keywords: "AI platform, artificial intelligence, machine learning, AI image generation, Zyfoox, LearnFlow, AI education, cognitive enhancement, AI tools, automation, technology innovation, neural enhancement, AI learning platform, personalized education, adaptive learning, AI image generator, AI art, generative AI, deep learning, computer vision, natural language processing",
  authors: [{ name: "Alexzo Team" }],
  creator: "Alexzo",
  publisher: "Alexzo",
  applicationName: "Alexzo Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Alexzo - AI-Powered Human Enhancement Platform | Zyfoox & LearnFlow",
    description: "Transform your ideas with cutting-edge AI technology. Create stunning images with Zyfoox AI Generator & master learning with LearnFlow 2.0. Join 75K+ users experiencing the future of AI.",
    url: siteUrl,
    siteName: "Alexzo",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Alexzo - AI-Powered Human Enhancement Platform Logo",
        type: "image/png",
      },
      {
        url: `${siteUrl}/images/products/zyfoox-interface.png`,
        width: 1200,
        height: 630,
        alt: "Zyfoox AI Image Generator Interface",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: "United States",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexzo - AI-Powered Human Enhancement Platform | Zyfoox & LearnFlow",
    description: "Transform your ideas with cutting-edge AI technology. Create stunning images with Zyfoox AI Generator & master learning with LearnFlow 2.0. Join 75K+ users experiencing the future of AI.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        alt: "Alexzo - AI-Powered Human Enhancement Platform",
      }
    ],
    creator: "@alexzo",
    site: "@alexzo",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: verificationCodes.google[0],
  },
  referrer: "origin-when-cross-origin",
  category: "Technology",
  generator: 'Alexzo',
  other: {
    "google": "notranslate",
  }
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    colorScheme: 'dark light',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Google Search Console Verification - Additional codes */}
        <meta name="google-site-verification" content="LciVAzACk6a_cqUyi_rfYQqgsrX5AUuiWbsCLg5mOs0" />
        
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-CRDQVE5LF3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CRDQVE5LF3');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T9LXBR24');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T9LXBR24"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <main>{children}</main>
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#1f2937",
                    border: "1px solid #374151",
                    color: "#f9fafb",
                  },
                }}
              />
              <Analytics />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
