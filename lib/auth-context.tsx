"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured as supabaseConfigured } from "@/lib/public-env"

interface AuthContextType {
  user: User | null
  loading: boolean
  userAvatar: string | null
  signInWithGoogle: () => Promise<{ error: string | null; success?: boolean }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{
    error: string | null
    success?: boolean
  }>
  isSupabaseConfigured: boolean
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
  const [user, setUser] = useState<User | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        // Debug environment variables
        console.log('Environment variables check:', {
          urlPresent: !!SUPABASE_URL,
          keyPresent: !!SUPABASE_ANON_KEY,
          urlValue: SUPABASE_URL,
          keyValue: SUPABASE_ANON_KEY ? '***EXISTS***' : 'undefined',
          isConfigured: supabaseConfigured
        })

        if (!supabaseConfigured) {
          console.log("Supabase environment variables not found - setting isSupabaseConfigured to false")
          setIsSupabaseConfigured(false)
          setLoading(false)
          setInitialized(true)
          return
        }

        const supabaseClient = createClientComponentClient({
          supabaseUrl: SUPABASE_URL,
          supabaseKey: SUPABASE_ANON_KEY
        })

        // Set as configured since environment variables are present
        console.log("Initializing Supabase with environment variables")
        console.log("Setting isSupabaseConfigured to true")
        setIsSupabaseConfigured(true)

        setSupabase(supabaseClient)

        // Set up basic auth state listener
        try {
          const {
            data: { subscription },
          } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email)

            if (event === "SIGNED_IN" && session?.user) {
              setUser(session.user)
              // Use a simple avatar for now
              setUserAvatar(getRandomAvatar())
            } else if (event === "SIGNED_OUT") {
              setUser(null)
              setUserAvatar(null)
            }
          })

          console.log("Auth initialization complete - isSupabaseConfigured should be true")
          setLoading(false)
          setInitialized(true)
          return () => subscription.unsubscribe()
        } catch (listenerError) {
          console.log("Auth state listener setup failed, but auth still configured:", listenerError)
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.warn("Auth initialization failed:", error)
        // Don't reset isSupabaseConfigured to false here, keep it as configured since env vars exist
        console.log("Auth initialization error - keeping isSupabaseConfigured as true since env vars exist")
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      initializeAuth()
    }
  }, [initialized])

  const signInWithGoogle = async () => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: "Google sign-in is not available. Please check your connection." }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error("Google sign-in error:", error)
        return { error: "Failed to sign in with Google. Please try again." }
      }

      // OAuth will redirect, so we don't get immediate user data
      return { error: null, success: true }
    } catch (error) {
      console.error("Google sign-in exception:", error)
      return { error: "Failed to sign in with Google. Please try again." }
    }
  }

  const signOut = async () => {
    if (!supabase || !isSupabaseConfigured) {
      console.log("Signing out without Supabase")
      setUser(null)
      setUserAvatar(null)
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      }
      
      setUser(null)
      setUserAvatar(null)
    } catch (error) {
      console.error("Sign out exception:", error)
      // Still clear local state even if sign out fails
      setUser(null)
      setUserAvatar(null)
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      return { error: "You must be logged in to update your profile." }
    }

    if (!supabase || !isSupabaseConfigured) {
      return { error: "Profile updates are not available. Please check your connection." }
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Profile update failed:", error)
        return { error: "Failed to update profile. Please try again." }
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
    isSupabaseConfigured,
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