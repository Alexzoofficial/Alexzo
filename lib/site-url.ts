/**
 * Get the site URL based on the environment
 * Works on both client-side (browser) and server-side (build time, SSR)
 * Automatically detects the correct domain in all environments
 */
export function getSiteUrl(): string {
  // Client-side: use the actual browser origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side: check environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`
  }
  
  // Fallback only for build-time when no env vars are set
  return 'https://alexzo.vercel.app'
}

export const siteUrl = getSiteUrl()
