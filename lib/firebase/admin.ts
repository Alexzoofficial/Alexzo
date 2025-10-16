// Firebase admin configuration for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

let adminApp: any = null

// Initialize Firebase Admin SDK
export function getFirebaseAdmin() {
  if (adminApp) {
    return adminApp
  }

  const apps = getApps()
  if (apps.length > 0) {
    adminApp = apps[0]
    return adminApp
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!privateKey || !clientEmail || !projectId) {
      console.warn('Firebase admin credentials not configured, server-side operations may be limited')
      return null
    }

    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
    })

    return adminApp
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    return null
  }
}

// Get Firestore instance
export function getAdminFirestore() {
  const app = getFirebaseAdmin()
  return app ? getFirestore(app) : null
}

// Get Auth instance
export function getAdminAuth() {
  const app = getFirebaseAdmin()
  return app ? getAuth(app) : null
}