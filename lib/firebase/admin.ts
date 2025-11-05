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
    
    // Fallback to environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    if (!privateKey || !clientEmail || !projectId) {
      console.error(`
        ================================================================================
        ** FIREBASE ADMIN CREDENTIALS ERROR **

        Firebase Admin SDK credentials are not configured. Server-side operations
        like creating API keys will fail.

        Please configure the following environment variables:
        - FIREBASE_PRIVATE_KEY
        - FIREBASE_CLIENT_EMAIL
        - NEXT_PUBLIC_FIREBASE_PROJECT_ID

        Alternatively, you can place your service account JSON file at:
        'lib/firebase/credentials/service-account.json'

        For more details, see the Firebase Admin SDK setup documentation.
        ================================================================================
      `);
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