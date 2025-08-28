"use client"

import { useEffect } from "react"
import Script from "next/script"

// This component handles analytics scripts in a secure way
export function Analytics() {
  // Load Google Analytics
  useEffect(() => {
    // This code runs only on the client side
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      gtag("js", new Date())
      gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        anonymize_ip: true,
      })
    }
  }, [])

  return (
    <>
      {/* Google Analytics Script - Loaded with Strategy 'afterInteractive' for better performance */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `,
            }}
          />
        </>
      )}
    </>
  )
}
