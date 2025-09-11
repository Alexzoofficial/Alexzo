"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

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

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          console.log("Supabase environment variables not found")
          setIsSupabaseConfigured(false)
          setLoading(false)
          setInitialized(true)
          return
        }

        const supabaseClient = createClientComponentClient()

        // Initialize Supabase and assume it's configured if env vars are present
        console.log("Initializing Supabase with environment variables")
        
        // Test connection with timeout
        try {
          const connectionTest = Promise.race([
            supabaseClient.auth.getSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000)),
          ])

          const { data, error } = (await connectionTest) as any

          if (error) {
            console.warn("Supabase connection error, but continuing with configuration:", error)
          }
          
          // Set as configured regardless of connection test result since env vars are present
          setIsSupabaseConfigured(true)
          
          // Handle existing session if available
          if (data?.session?.user) {
            console.log("Restoring Supabase session for:", data.session.user.email)
            setUser(data.session.user)
            
            try {
              const { data: profile } = await supabaseClient
                .from("profiles")
                .select("avatar_url, full_name")
                .eq("id", data.session.user.id)
                .single()

              let avatar = profile?.avatar_url
              if (!avatar) {
                avatar = getRandomAvatar()
                await supabaseClient.from("profiles").upsert({
                  id: data.session.user.id,
                  full_name: data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0],
                  avatar_url: avatar,
                  email: data.session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }

              setUserAvatar(avatar)
            } catch (profileError) {
              console.log("Profile handling failed:", profileError)
              setUserAvatar(getRandomAvatar())
            }
          }
        } catch (connectionError) {
          console.warn("Connection test failed, but continuing with Supabase configuration:", connectionError)
          setIsSupabaseConfigured(true)
        }

        setSupabase(supabaseClient)

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email)

          if (event === "SIGNED_IN" && session?.user) {
            setUser(session.user)
            try {
              const { data: profile, error: fetchError } = await supabaseClient
                .from("profiles")
                .select("avatar_url, full_name")
                .eq("id", session.user.id)
                .single()

              let avatar = profile?.avatar_url
              if (!avatar || fetchError) {
                avatar = getRandomAvatar()
                const { error: upsertError } = await supabaseClient.from("profiles").upsert(
                  {
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
                    avatar_url: avatar,
                    email: session.user.email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                  {
                    onConflict: "id",
                  },
                )

                if (upsertError) {
                  console.log("Profile upsert failed:", upsertError)
                }
              }

              setUserAvatar(avatar)
            } catch (error) {
              console.log("Profile handling failed, using random avatar:", error)
              const avatar = getRandomAvatar()
              setUserAvatar(avatar)
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            setUserAvatar(null)
          }
        })

        setLoading(false)
        setInitialized(true)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.warn("Auth initialization failed:", error)
        setIsSupabaseConfigured(false)
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