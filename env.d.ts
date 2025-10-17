declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
    GA_API_SECRET?: string
    NEXT_PUBLIC_SITE_URL?: string
    // Firebase configuration
    NEXT_PUBLIC_FIREBASE_API_KEY?: string
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string
    NEXT_PUBLIC_FIREBASE_DATABASE_URL?: string
    NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string
    NEXT_PUBLIC_FIREBASE_APP_ID?: string
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string
    FIREBASE_PRIVATE_KEY?: string
    FIREBASE_CLIENT_EMAIL?: string
  }
}

interface Window {
  dataLayer: any[]
  gtag: (...args: any[]) => void
}
