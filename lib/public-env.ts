// Build-time environment constants for client-side use

// Firebase configuration
export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''

// Check if Firebase is properly configured
export const isFirebaseConfigured = Boolean(FIREBASE_API_KEY && FIREBASE_PROJECT_ID && FIREBASE_APP_ID)