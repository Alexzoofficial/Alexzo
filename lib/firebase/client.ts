// Firebase client configuration for browser use
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Check if required Firebase environment variables are available
const hasRequiredFirebaseVars = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID !== 'undefined'
)

// Only create Firebase config if required variables exist
let firebaseConfig: any = null
let app: FirebaseApp | null = null

if (hasRequiredFirebaseVars) {
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }

  try {
    // Initialize Firebase app only if config is valid
    app = initializeApp(firebaseConfig)
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase:', error)
    app = null
  }
} else {
  console.warn('Firebase environment variables not configured. Authentication features will be disabled.')
}

// Initialize Firebase services conditionally
export const auth: Auth | null = app ? getAuth(app) : null
export const db: Firestore | null = app ? getFirestore(app) : null
export const googleProvider: GoogleAuthProvider | null = app ? new GoogleAuthProvider() : null

// Configure Google OAuth provider for better Vercel compatibility (only if available)
if (googleProvider) {
  googleProvider.setCustomParameters({
    'prompt': 'select_account'
  })
}

// Export Firebase configuration status
export const isFirebaseConfigured = hasRequiredFirebaseVars && app !== null

export default app