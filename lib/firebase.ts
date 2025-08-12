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

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

// Initialize Analytics only on client side
export const analytics =
  typeof window !== "undefined"
    ? (async () => {
        if (await isSupported()) {
          return getAnalytics(app)
        }
        return null
      })()
    : null

export default app
