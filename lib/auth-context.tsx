"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from "firebase/auth"
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client"

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  userAvatar: string | null
  signInWithGoogle: () => Promise<{ error: string | null; success?: boolean }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{
    error: string | null
    success?: boolean
  }>
  isFirebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Generate random avatar for new users
const getRandomAvatar = () => {
  const avatars = [
    "/images/avatars/user-1.png",
    "/images/avatars/user-2.png",
    "/images/avatars/user-3.png",
    "/images/avatars/user-4.png",
    "/images/avatars/user-5.png",
  ]
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        console.log('Firebase configuration check:', {
          isConfigured: isFirebaseConfigured,
          hasAuth: !!auth
        })

        if (!isFirebaseConfigured) {
          console.log("Firebase not configured - authentication unavailable")
          setLoading(false)
          setInitialized(true)
          return
        }

        // Set up Firebase auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          console.log("Firebase auth state changed:", firebaseUser?.email || 'no user')

          if (firebaseUser) {
            console.log("Setting user data:", firebaseUser.email)
            setUser(firebaseUser)

            // Load or create user profile
            await loadUserProfile(firebaseUser)
          } else {
            console.log("User signed out, clearing data")
            setUser(null)
            setUserAvatar(null)
          }

          // Set loading to false after first auth state event
          if (!initialized) {
            setLoading(false)
            setInitialized(true)
          }
        })

        console.log("Firebase auth state listener set up successfully")
        
        // Return cleanup function
        return unsubscribe
      } catch (error) {
        console.warn("Firebase auth initialization failed:", error)
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      const cleanup = initializeAuth()
      return cleanup
    }
  }, [initialized])

  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "profiles", firebaseUser.uid))
      
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        setUserAvatar(profileData.avatar_url || getRandomAvatar())
      } else {
        // Create new profile for first-time user
        const randomAvatar = getRandomAvatar()
        const profileData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || '',
          avatar_url: randomAvatar,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        await setDoc(doc(db, "profiles", firebaseUser.uid), profileData)
        setUserAvatar(randomAvatar)
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
      setUserAvatar(getRandomAvatar())
    }
  }

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      return { error: "Google sign-in is not available. Please check your connection." }
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign-in successful:", result.user.email)
      return { error: null, success: true }
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { error: "Sign-in was cancelled. Please try again." }
      } else if (error.code === 'auth/popup-blocked') {
        return { error: "Pop-up was blocked by your browser. Please allow pop-ups and try again." }
      } else {
        return { error: "Unable to connect to Google authentication. Please check your internet connection and try again." }
      }
    }
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      console.log("Signing out without Firebase")
      setUser(null)
      setUserAvatar(null)
      return
    }

    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserAvatar(null)
    } catch (error) {
      console.error("Sign out error:", error)
      // Still clear local state even if sign out fails
      setUser(null)
      setUserAvatar(null)
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      return { error: "You must be logged in to update your profile." }
    }

    if (!isFirebaseConfigured) {
      return { error: "Profile updates are not available. Please check your connection." }
    }

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      await updateDoc(doc(db, "profiles", user.uid), updateData)

      if (updates.avatar_url) {
        setUserAvatar(updates.avatar_url)
      }

      return { error: null, success: true }
    } catch (error) {
      console.error("Profile update exception:", error)
      return { error: "An unexpected error occurred while updating your profile." }
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    userAvatar,
    signInWithGoogle,
    signOut,
    updateProfile,
    isFirebaseConfigured,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}