import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyDAfy2fyJYLDA3WjK-VAo_zGgrYcxjkzws",
  authDomain: "alexzo.firebaseapp.com",
  databaseURL: "https://alexzo-default-rtdb.firebaseio.com",
  projectId: "alexzo",
  storageBucket: "alexzo.firebasestorage.app",
  messagingSenderId: "685761333626",
  appId: "1:685761333626:web:e23150066930f804cd6ec3",
  measurementId: "G-386HB7B9VJ",
}

// Initialize Firebase app
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error("Firebase initialization error:", error)
  app = initializeApp(firebaseConfig)
}

// Initialize services with error handling
let auth
let database
let storage
let analytics = null

try {
  auth = getAuth(app)
} catch (error) {
  console.error("Auth initialization error:", error)
}

try {
  database = getDatabase(app)
} catch (error) {
  console.error("Database initialization error:", error)
}

try {
  storage = getStorage(app)
} catch (error) {
  console.error("Storage initialization error:", error)
}

// Initialize Analytics only on client side
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app)
      } catch (error) {
        console.error("Analytics initialization error:", error)
      }
    }
  })
}

export { auth, database, storage, analytics }
export default app
