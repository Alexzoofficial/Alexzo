"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { auth } from "./firebase"
import { firebaseHelpers } from "./firebase-helpers"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      // Log authentication events
      try {
        await firebaseHelpers.logAnalytics({
          event: firebaseUser ? "user_signed_in" : "user_signed_out",
          userId: firebaseUser?.uid || "anonymous",
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.log("Analytics logging failed:", error)
      }
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await firebaseHelpers.logAnalytics({
        event: "sign_in_success",
        userId: result.user.uid,
        method: "email",
      })
    } catch (error: any) {
      await firebaseHelpers.logAnalytics({
        event: "sign_in_error",
        error: error.message,
        method: "email",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      if (displayName) {
        await firebaseUpdateProfile(result.user, { displayName })
      }

      // Save user profile to database
      await firebaseHelpers.saveProfile(result.user.uid, {
        email: result.user.email,
        displayName: displayName || result.user.displayName,
        createdAt: new Date().toISOString(),
      })

      await firebaseHelpers.logAnalytics({
        event: "sign_up_success",
        userId: result.user.uid,
        method: "email",
      })
    } catch (error: any) {
      await firebaseHelpers.logAnalytics({
        event: "sign_up_error",
        error: error.message,
        method: "email",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      await firebaseHelpers.logAnalytics({
        event: "sign_out_success",
      })
    } catch (error: any) {
      await firebaseHelpers.logAnalytics({
        event: "sign_out_error",
        error: error.message,
      })
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      await firebaseHelpers.logAnalytics({
        event: "password_reset_sent",
        email,
      })
    } catch (error: any) {
      await firebaseHelpers.logAnalytics({
        event: "password_reset_error",
        error: error.message,
        email,
      })
      throw error
    }
  }

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error("No user logged in")

    try {
      await firebaseUpdateProfile(user, data)
      await firebaseHelpers.saveProfile(user.uid, {
        ...data,
        updatedAt: new Date().toISOString(),
      })

      await firebaseHelpers.logAnalytics({
        event: "profile_updated",
        userId: user.uid,
      })
    } catch (error: any) {
      await firebaseHelpers.logAnalytics({
        event: "profile_update_error",
        error: error.message,
        userId: user.uid,
      })
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
