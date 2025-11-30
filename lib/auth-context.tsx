"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from "firebase/auth"
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client"

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  userAvatar: string | null
  signInWithGoogle: (useRedirect?: boolean) => Promise<{ error: string | null; success?: boolean }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{
    error: string | null
    success?: boolean
  }>
  isFirebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined' || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        await loadUserProfile(firebaseUser)
      } else {
        setUser(null)
        setUserAvatar(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const googlePhotoURL = firebaseUser.photoURL || null
      setUserAvatar(googlePhotoURL)
      
      if (!db) {
        console.warn("Firestore not available, using Google profile photo")
        return
      }
      const userDoc = await getDoc(doc(db, "profiles", firebaseUser.uid))
      
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        setUserAvatar(googlePhotoURL || profileData.avatar_url || null)
      } else {
        const profileData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName || '',
          avatar_url: googlePhotoURL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        if (db) {
          await setDoc(doc(db, "profiles", firebaseUser.uid), profileData)
        }
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
      setUserAvatar(firebaseUser.photoURL || null)
    }
  }

  const signInWithGoogle = async (useRedirect = false) => {
    if (!isFirebaseConfigured) {
      const missingVars = []
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingVars.push('API_KEY')
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingVars.push('PROJECT_ID')
      if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingVars.push('APP_ID')
      
      console.error("Firebase not configured. Missing:", missingVars.join(', '))
      return { error: "Authentication service is currently unavailable. Please try again later or contact support if the issue persists." }
    }

    // Check for any stored redirect errors first
    if (typeof window !== 'undefined') {
      const redirectError = sessionStorage.getItem('auth_redirect_error')
      if (redirectError) {
        sessionStorage.removeItem('auth_redirect_error')
        return { error: redirectError }
      }
    }

    // Use redirect method if explicitly requested
    if (useRedirect) {
      try {
        if (!auth || !googleProvider) {
          return { error: "Authentication service is not properly configured." }
        }
        console.log("Starting Google redirect flow...")
        await signInWithRedirect(auth, googleProvider)
        // Redirect flow doesn't return immediately, user will be redirected
        return { error: null, success: true }
      } catch (error: any) {
        console.error("Google redirect error:", error)
        return { error: "Unable to redirect to Google authentication. Please try again." }
      }
    }

    // Try popup method first
    try {
      if (!auth || !googleProvider) {
        return { error: "Authentication service is not properly configured." }
      }
      console.log("Starting Google popup flow...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign-in successful:", result.user.email)
      return { error: null, success: true }
    } catch (error: any) {
      console.error("Google popup sign-in error:", error)
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { error: "Sign-in was cancelled. Please try again." }
      } else if (error.code === 'auth/popup-blocked') {
        // Offer redirect as alternative
        console.log("Popup blocked, offering redirect alternative")
        return { 
          error: "Pop-up was blocked. Would you like to try an alternative sign-in method?",
          popupBlocked: true 
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        console.error("Unauthorized domain error - likely Vercel domain not added to Firebase authorized domains")
        return { error: "This website domain is not authorized for sign-in. This is a configuration issue - please try again in a few minutes or contact support." }
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
      if (!auth) {
        console.log("Firebase auth not available for sign out")
        setUser(null)
        setUserAvatar(null)
        return
      }
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

      // Update Firestore profile
      if (!db) {
        return { error: "Profile updates are not available - database not configured." }
      }
      await updateDoc(doc(db, "profiles", user.uid), updateData)

      // Also update Firebase Auth displayName if full_name is provided
      if (updates.full_name && auth && auth.currentUser) {
        const { updateProfile: updateAuthProfile } = await import("firebase/auth")
        await updateAuthProfile(auth.currentUser, {
          displayName: updates.full_name
        })
        // Refresh the auth state to reflect the displayName change
        if (auth.currentUser) {
          await auth.currentUser.reload()
        }
      }

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