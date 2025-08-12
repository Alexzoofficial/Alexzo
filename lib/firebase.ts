import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

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

// Initialize Firebase
let app
let auth
let database
let analytics

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  auth = getAuth(app)
  database = getDatabase(app)

  if (typeof window !== "undefined") {
    analytics = getAnalytics(app)
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
}

export { auth, database, analytics }
