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

interface AuthContextType {
  user: User | null
  loading: boolean
  userAvatar: string | null
  login: (email: string, password: string) => Promise<{ error: string | null; success?: boolean }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; success?: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null; success?: boolean }>
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

  const code = error.code || ""
  const message = error.message?.toLowerCase() || ""

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "The email or password you entered is incorrect. Please check your credentials and try again."
  }

  if (code === "auth/too-many-requests") {
    return "Too many login attempts. Please wait a few minutes before trying again."
  }

  if (code === "auth/user-not-found") {
    return "No account found with this email address. Please sign up first."
  }

  if (code === "auth/weak-password") {
    return "Password must be at least 6 characters long."
  }

  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists. Please sign in instead."
  }

  if (code === "auth/network-request-failed") {
    return "Network error. Please check your connection and try again."
  }

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address."
  }

  return "Authentication failed. Please try again."
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false)
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

        // Check for existing demo session first
        const demoSession = getDemoSession()

        try {
          // Try to initialize Firebase
          const { auth } = await import("./firebase")
          const { firebaseHelpers } = await import("./firebase-helpers")

          if (!auth) {
            throw new Error("Firebase auth not initialized")
          }

          setIsFirebaseConfigured(true)

          // Set up auth state listener
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("Auth state changed:", firebaseUser?.email)

            if (firebaseUser) {
              setUser(firebaseUser)

              try {
                // Get or create profile
                const profile = await firebaseHelpers.getProfile(firebaseUser.uid)
                let avatar = profile?.avatar_url

                if (!profile || !avatar) {
                  avatar = getRandomAvatar()
                  await firebaseHelpers.saveProfile(firebaseUser.uid, {
                    full_name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                    avatar_url: avatar,
                    email: firebaseUser.email,
                  })
                }

                setUserAvatar(avatar)

                // Save to demo session as backup
                saveDemoSession({
                  ...firebaseUser,
                  avatar,
                })
              } catch (profileError) {
                console.log("Profile handling failed, using random avatar:", profileError)
                const avatar = getRandomAvatar()
                setUserAvatar(avatar)

                saveDemoSession({
                  ...firebaseUser,
                  avatar,
                })
              }
            } else {
              setUser(null)
              setUserAvatar(null)
              saveDemoSession(null)
            }

            setLoading(false)
          })

          setInitialized(true)
          return unsubscribe
        } catch (firebaseError) {
          console.warn("Firebase connection error, falling back to demo mode:", firebaseError)

          // Check for demo session as fallback
          if (demoSession) {
            console.log("Restoring demo session as fallback for:", demoSession.email)
            setUser(demoSession)
            setUserAvatar(demoSession.avatar || getRandomAvatar())
          }

          setIsFirebaseConfigured(false)
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.warn("Auth initialization failed, checking for demo session:", error)

        // Check for demo session as final fallback
        const demoSession = getDemoSession()
        if (demoSession) {
          console.log("Restoring demo session as final fallback for:", demoSession.email)
          setUser(demoSession)
          setUserAvatar(demoSession.avatar || getRandomAvatar())
        }

        setIsFirebaseConfigured(false)
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      initializeAuth()
    }
  }, [initialized])

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!normalizedEmail || !cleanPassword) {
      return { error: "Please enter both email and password." }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return { error: "Please enter a valid email address." }
    }

    if (!isFirebaseConfigured) {
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
        uid: demoUser.id,
        email: normalizedEmail,
        displayName: demoUser.fullName,
        emailVerified: true,
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
      console.log("Attempting Firebase login for:", normalizedEmail)

      const { auth } = await import("./firebase")
      if (!auth) {
        throw new Error("Firebase auth not available")
      }

      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, cleanPassword)

      if (userCredential.user) {
        console.log("Firebase login successful:", userCredential.user.email)
        return { error: null, success: true }
      }

      return { error: "Login failed. Please try again." }
    } catch (error) {
      console.error("Login exception:", error)
      return { error: getAuthErrorMessage(error) }
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
    if (!isFirebaseConfigured) {
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
          uid: userId,
          email: normalizedEmail,
          displayName: normalizedName,
          emailVerified: true,
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

    // Firebase mode handling
    try {
      console.log("Firebase mode: attempting signup for", normalizedEmail)

      const { auth } = await import("./firebase")
      const { firebaseHelpers } = await import("./firebase-helpers")

      if (!auth) {
        throw new Error("Firebase auth not available")
      }

      // Create user with Firebase Auth (no email verification)
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, cleanPassword)

      if (userCredential.user) {
        console.log("Firebase signup successful:", userCredential.user.email)

        // Update display name
        await firebaseUpdateProfile(userCredential.user, {
          displayName: normalizedName,
        })

        // Create profile in Firebase Database
        try {
          const avatar = getRandomAvatar()
          await firebaseHelpers.saveProfile(userCredential.user.uid, {
            full_name: normalizedName,
            avatar_url: avatar,
            email: normalizedEmail,
          })

          setUserAvatar(avatar)

          saveDemoSession({
            ...userCredential.user,
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
      return { error: getAuthErrorMessage(error) }
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

    if (!isFirebaseConfigured) {
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
      const { auth } = await import("./firebase")
      if (!auth) {
        throw new Error("Firebase auth not available")
      }

      await sendPasswordResetEmail(auth, normalizedEmail)

      return {
        error: null,
        success: true,
      }
    } catch (error) {
      console.error("Password reset exception:", error)
      return { error: getAuthErrorMessage(error) }
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      return { error: "You must be logged in to update your profile." }
    }

    if (!isFirebaseConfigured) {
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
          displayName: updates.full_name || user.displayName,
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
      const { firebaseHelpers } = await import("./firebase-helpers")

      // Update Firebase Auth profile
      if (updates.full_name) {
        await firebaseUpdateProfile(user, {
          displayName: updates.full_name,
        })
      }

      // Update Firebase Database profile
      await firebaseHelpers.saveProfile(user.uid, {
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
      })

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
    if (!isFirebaseConfigured) {
      setUser(null)
      setUserAvatar(null)
      saveDemoSession(null)
      return
    }

    try {
      const { auth } = await import("./firebase")
      if (auth) {
        await firebaseSignOut(auth)
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
        login,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        isFirebaseConfigured,
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
