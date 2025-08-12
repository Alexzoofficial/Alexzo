"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { dbHelpers } from "./supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  userAvatar: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null; success?: boolean }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; success?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null; success?: boolean }>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{
    error: string | null
    success?: boolean
  }>
  resendVerification: (email: string) => Promise<{ error: string | null; success?: boolean }>
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

// In-memory user storage for demo mode with persistence
const DEMO_USERS_KEY = "alexzo_demo_users"
const DEMO_SESSION_KEY = "alexzo_demo_session"

const getDemoUsers = () => {
  if (typeof window === "undefined") return new Map()
  try {
    const stored = localStorage.getItem(DEMO_USERS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.warn("Failed to load demo users from localStorage:", error)
  }
  return new Map()
}

const saveDemoUsers = (users: Map<string, any>) => {
  if (typeof window === "undefined") return
  try {
    const obj = Object.fromEntries(users)
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(obj))
  } catch (error) {
    console.warn("Failed to save demo users to localStorage:", error)
  }
}

const getDemoSession = () => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(DEMO_SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn("Failed to load demo session from localStorage:", error)
    return null
  }
}

const saveDemoSession = (session: any) => {
  if (typeof window === "undefined") return
  try {
    if (session) {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(DEMO_SESSION_KEY)
    }
  } catch (error) {
    console.warn("Failed to save demo session to localStorage:", error)
  }
}

// Helper function to provide user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
  if (!error) return ""

  const message = error.message?.toLowerCase() || ""

  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
    return "The email or password you entered is incorrect. Please check your credentials and try again."
  }

  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Too many login attempts. Please wait a few minutes before trying again."
  }

  if (message.includes("user not found")) {
    return "No account found with this email address. Please sign up first."
  }

  if (message.includes("weak password")) {
    return "Password must be at least 6 characters long."
  }

  if (message.includes("email already registered") || message.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead."
  }

  if (message.includes("network") || message.includes("connection")) {
    return "Network error. Please check your connection and try again."
  }

  if (message.includes("duplicate key") || message.includes("unique constraint")) {
    return "An account with this email already exists. Please sign in instead."
  }

  return "Authentication failed. Please try again."
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Initialize demo users storage
  const [demoUsers] = useState(() => getDemoUsers())

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        // Use your Supabase credentials
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ucmhhbzfljskelobfgdm.supabase.co"
        const supabaseKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbWhoYnpmbGpza2Vsb2JmZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDcxOTAsImV4cCI6MjA2OTUyMzE5MH0.2FEhEcPy7TGTh_8DDohUpIrrrBgtc9iJWiEK5yutIhA"

        // Check for existing demo session first
        const demoSession = getDemoSession()
        if (demoSession && (!supabaseUrl || !supabaseKey)) {
          console.log("Restoring demo session for:", demoSession.email)
          setUser(demoSession)
          setUserAvatar(demoSession.avatar || getRandomAvatar())
          setIsSupabaseConfigured(false)
          setLoading(false)
          setInitialized(true)
          return
        }

        if (!supabaseUrl || !supabaseKey) {
          console.log("Supabase environment variables not found, using demo mode")
          setIsSupabaseConfigured(false)
          setLoading(false)
          setInitialized(true)
          return
        }

        const supabaseClient = createClientComponentClient()

        // Test connection with timeout
        const connectionTest = Promise.race([
          supabaseClient.auth.getSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 8000)),
        ])

        const { data, error } = (await connectionTest) as any

        if (error) {
          console.warn("Supabase connection error, falling back to demo mode:", error)

          // Check for demo session as fallback
          if (demoSession) {
            console.log("Restoring demo session as fallback for:", demoSession.email)
            setUser(demoSession)
            setUserAvatar(demoSession.avatar || getRandomAvatar())
          }

          setIsSupabaseConfigured(false)
          setLoading(false)
          setInitialized(true)
          return
        }

        setSupabase(supabaseClient)
        setIsSupabaseConfigured(true)

        // Restore existing session
        if (data.session?.user) {
          console.log("Restoring Supabase session for:", data.session.user.email)
          setUser(data.session.user)

          try {
            const profile = await dbHelpers.getProfile(data.session.user.id)
            let avatar = profile?.avatar_url

            if (!avatar) {
              avatar = getRandomAvatar()
              await dbHelpers.createProfile({
                id: data.session.user.id,
                full_name: data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0],
                avatar_url: avatar,
                email: data.session.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
            }

            setUserAvatar(avatar)

            // Save to demo session as backup
            saveDemoSession({
              ...data.session.user,
              avatar,
            })
          } catch (profileError) {
            console.log("Profile handling failed, creating new profile:", profileError)
            const avatar = getRandomAvatar()

            try {
              await dbHelpers.createProfile({
                id: data.session.user.id,
                full_name: data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0],
                avatar_url: avatar,
                email: data.session.user.email,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              setUserAvatar(avatar)
            } catch (createError) {
              console.log("Profile creation failed:", createError)
              setUserAvatar(avatar)
            }

            saveDemoSession({
              ...data.session.user,
              avatar,
            })
          }
        } else {
          // No active session, clear any demo session
          saveDemoSession(null)
        }

        // Set up auth state change listener
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email)

          if (event === "SIGNED_IN" && session?.user) {
            setUser(session.user)
            try {
              const profile = await dbHelpers.getProfile(session.user.id)
              let avatar = profile?.avatar_url

              if (!avatar) {
                avatar = getRandomAvatar()
                await dbHelpers.createProfile({
                  id: session.user.id,
                  full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
                  avatar_url: avatar,
                  email: session.user.email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
              }

              setUserAvatar(avatar)

              saveDemoSession({
                ...session.user,
                avatar,
              })
            } catch (error) {
              console.log("Profile handling failed, using random avatar:", error)
              const avatar = getRandomAvatar()
              setUserAvatar(avatar)

              saveDemoSession({
                ...session.user,
                avatar,
              })
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            setUserAvatar(null)
            saveDemoSession(null)
          }
        })

        setLoading(false)
        setInitialized(true)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.warn("Auth initialization failed, checking for demo session:", error)

        // Check for demo session as final fallback
        const demoSession = getDemoSession()
        if (demoSession) {
          console.log("Restoring demo session as final fallback for:", demoSession.email)
          setUser(demoSession)
          setUserAvatar(demoSession.avatar || getRandomAvatar())
        }

        setIsSupabaseConfigured(false)
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      initializeAuth()
    }
  }, [initialized])

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!normalizedEmail || !cleanPassword) {
      return { error: "Please enter both email and password." }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return { error: "Please enter a valid email address." }
    }

    if (!supabase || !isSupabaseConfigured) {
      console.log("Demo mode: attempting login for", normalizedEmail)

      const demoUser = demoUsers.get(normalizedEmail)
      if (!demoUser) {
        return { error: "No account found with this email address. Please sign up first." }
      }

      // Simple password check for demo mode
      if (cleanPassword !== demoUser.password) {
        return { error: "The email or password you entered is incorrect. Please check your credentials and try again." }
      }

      const mockUser = {
        id: demoUser.id,
        email: normalizedEmail,
        user_metadata: { full_name: demoUser.fullName },
        created_at: demoUser.createdAt,
        email_confirmed_at: new Date().toISOString(),
      } as User

      const avatar = demoUser.avatar || getRandomAvatar()
      setUser(mockUser)
      setUserAvatar(avatar)

      // Save session for persistence
      saveDemoSession({
        ...mockUser,
        avatar,
      })

      return { error: null, success: true }
    }

    try {
      console.log("Attempting Supabase sign-in for:", normalizedEmail)

      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: cleanPassword,
      })

      if (error) {
        console.error("Supabase sign in failed:", error)
        return { error: getAuthErrorMessage(error) }
      }

      if (data.user) {
        console.log("Supabase sign in successful:", data.user.email)
        return { error: null, success: true }
      }

      return { error: "Sign in failed. Please try again." }
    } catch (error) {
      console.error("Sign in exception:", error)
      return { error: "An unexpected error occurred. Please try again." }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("SignUp called with:", { email, password: "***", fullName })

    // Input validation
    if (!email || !password || !fullName) {
      return { error: "Please fill in all fields." }
    }

    const normalizedEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()
    const normalizedName = fullName.trim()

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return { error: "Please enter a valid email address." }
    }

    // Password validation
    if (cleanPassword.length < 6) {
      return { error: "Password must be at least 6 characters long." }
    }

    // Name validation
    if (normalizedName.length < 2) {
      return { error: "Full name must be at least 2 characters long." }
    }

    // Demo mode handling
    if (!supabase || !isSupabaseConfigured) {
      console.log("Demo mode: attempting signup for", normalizedEmail)

      if (demoUsers.has(normalizedEmail)) {
        return { error: "An account with this email already exists. Please sign in instead." }
      }

      try {
        const userId = "demo-user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        const createdAt = new Date().toISOString()
        const avatar = getRandomAvatar()

        const newUser = {
          email: normalizedEmail,
          password: cleanPassword, // Store plain password for demo mode
          fullName: normalizedName,
          id: userId,
          createdAt,
          avatar,
          emailConfirmedAt: createdAt,
        }

        // Store user data and immediately sign them in
        demoUsers.set(normalizedEmail, newUser)
        saveDemoUsers(demoUsers)

        console.log("Demo user created successfully:", normalizedEmail)

        const mockUser = {
          id: userId,
          email: normalizedEmail,
          user_metadata: { full_name: normalizedName },
          created_at: createdAt,
          email_confirmed_at: createdAt,
        } as User

        setUser(mockUser)
        setUserAvatar(avatar)

        saveDemoSession({
          ...mockUser,
          avatar,
        })

        return { error: null, success: true }
      } catch (error) {
        console.error("Demo signup error:", error)
        return { error: "Failed to create account. Please try again." }
      }
    }

    // Supabase mode handling
    try {
      console.log("Supabase mode: attempting signup for", normalizedEmail)

      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: normalizedName,
          },
        },
      })

      if (error) {
        console.error("Supabase signup failed:", error)
        return { error: getAuthErrorMessage(error) }
      }

      if (data.user) {
        console.log("Supabase signup successful:", data.user.email)

        // Create profile
        try {
          const avatar = getRandomAvatar()
          await dbHelpers.createProfile({
            id: data.user.id,
            full_name: normalizedName,
            avatar_url: avatar,
            email: normalizedEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          setUser(data.user)
          setUserAvatar(avatar)

          saveDemoSession({
            ...data.user,
            avatar,
          })
        } catch (profileError) {
          console.error("Profile creation failed:", profileError)
          // Continue anyway, profile can be created later
        }

        return { error: null, success: true }
      }

      return { error: "Failed to create account. Please try again." }
    } catch (error) {
      console.error("SignUp exception:", error)
      return { error: "An unexpected error occurred. Please try again." }
    }
  }

  const resetPassword = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return { error: "Please enter your email address." }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return { error: "Please enter a valid email address." }
    }

    if (!supabase || !isSupabaseConfigured) {
      // Check if user exists in demo mode
      const demoUser = demoUsers.get(normalizedEmail)
      if (!demoUser) {
        return {
          error:
            "No account found with this email address. Please check the email you entered or create a new account.",
        }
      }

      // For demo mode, simulate sending reset code
      console.log("Demo mode: Password reset code would be sent to:", normalizedEmail)
      return {
        error: null,
        success: true,
      }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail)

      if (error) {
        console.error("Password reset failed:", error)
        return { error: getAuthErrorMessage(error) }
      }

      return {
        error: null,
        success: true,
      }
    } catch (error) {
      console.error("Password reset exception:", error)
      return {
        error: "No account found with this email address. Please check the email you entered or create a new account.",
      }
    }
  }

  const resendVerification = async (email: string) => {
    // Since we're not using email verification, this is not needed
    return { error: "Email verification is not required for this application." }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      return { error: "You must be logged in to update your profile." }
    }

    if (!supabase || !isSupabaseConfigured) {
      // Update demo user
      const demoUser = demoUsers.get(user.email!)
      if (demoUser) {
        if (updates.full_name) demoUser.fullName = updates.full_name
        if (updates.avatar_url) demoUser.avatar = updates.avatar_url

        demoUsers.set(user.email!, demoUser)
        saveDemoUsers(demoUsers)

        if (updates.avatar_url) setUserAvatar(updates.avatar_url)

        const updatedUser = {
          ...user,
          user_metadata: { ...user.user_metadata, full_name: updates.full_name || user.user_metadata?.full_name },
        }
        setUser(updatedUser)
        saveDemoSession({
          ...updatedUser,
          avatar: updates.avatar_url || userAvatar,
        })
      }

      return { error: null, success: true }
    }

    try {
      await dbHelpers.updateProfile(user.id, updates)

      if (updates.avatar_url) {
        setUserAvatar(updates.avatar_url)
      }

      saveDemoSession({
        ...user,
        avatar: updates.avatar_url || userAvatar,
      })

      return { error: null, success: true }
    } catch (error) {
      console.error("Profile update exception:", error)
      return { error: "Failed to update profile. Please try again." }
    }
  }

  const signOut = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setUser(null)
      setUserAvatar(null)
      saveDemoSession(null)
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      } else {
        console.log("Sign out successful")
      }

      // Always clear local state and demo session
      setUser(null)
      setUserAvatar(null)
      saveDemoSession(null)
    } catch (error) {
      console.error("Sign out exception:", error)
      setUser(null)
      setUserAvatar(null)
      saveDemoSession(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userAvatar,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        resendVerification,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
