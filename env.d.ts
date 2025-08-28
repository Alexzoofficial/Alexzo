declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
    GA_API_SECRET?: string
    NEXT_PUBLIC_SITE_URL?: string
    SUPABASE_URL?: string
    SUPABASE_ANON_KEY?: string
    SUPABASE_SERVICE_ROLE_KEY?: string
    NEXT_PUBLIC_SUPABASE_URL?: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL?: string
  }
}

interface Window {
  dataLayer: any[]
  gtag: (...args: any[]) => void
}
