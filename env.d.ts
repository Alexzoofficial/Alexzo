declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
  }
}

interface Window {
  dataLayer: any[]
  gtag: (...args: any[]) => void
}
