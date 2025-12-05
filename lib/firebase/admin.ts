// Firebase admin configuration for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import * as path from 'path'
import * as fs from 'fs'

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
    // Try to load from service account file first
    const serviceAccountPath = path.join(process.cwd(), 'lib', 'firebase', 'credentials', 'service-account.json')
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
      })
      
      console.log('Firebase Admin initialized with service account file')
      return adminApp
    }
    
    // Check for emulator environment for testing
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'test-project'
      adminApp = initializeApp({ projectId })
      return adminApp
    }

    // Fallback to environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`)
      : undefined;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!privateKey || !clientEmail || !projectId) {
      // Throw an error if credentials are not configured
      // This provides a clear failure reason instead of letting other services fail silently
      let errorMessage = 'Firebase admin credentials not configured. Server-side operations will be disabled. See ENVIRONMENT_SETUP.md for instructions.'
      if (!projectId) errorMessage += '\n- NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing.'
      if (!clientEmail) errorMessage += '\n- FIREBASE_CLIENT_EMAIL is missing.'
      if (!privateKey) errorMessage += '\n- FIREBASE_PRIVATE_KEY is missing.'
      throw new Error(errorMessage)
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
  if (!app) {
    throw new Error('Firebase Admin SDK not initialized. Firestore cannot be accessed.')
  }
  return getFirestore(app)
}

// Get Auth instance
export function getAdminAuth() {
  const app = getFirebaseAdmin()
  if (!app) {
    throw new Error('Firebase Admin SDK not initialized. Auth cannot be accessed.')
  }
  return getAuth(app)
}