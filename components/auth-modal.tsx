"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { SafeImage } from "@/components/safe-image"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
  defaultMode?: "signup" | "login" | "forgot"
}

// Google OAuth icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export function AuthModal({ isOpen, onClose, initialMode = "signin", defaultMode }: AuthModalProps) {
  const [mode, setMode] = useState<"oauth" | "demo" | "signup" | "success">("oauth")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")

  const { signIn, signUp, signInWithGoogle, isSupabaseConfigured } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setMode(isSupabaseConfigured ? "oauth" : "demo")
    } else {
      setEmail("")
      setPassword("")
      setFullName("")
      setShowPassword(false)
      setError("")
      setValidationErrors({})
      setSuccessMessage("")
      setLoading(false)
    }
  }, [isOpen, isSupabaseConfigured])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!email) {
      errors.email = "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address"
      }
    }

    if (mode === "demo" || mode === "signup") {
      if (!password) {
        errors.password = "Password is required"
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long"
      }
    }

    if (mode === "signup") {
      if (!fullName) {
        errors.fullName = "Full name is required"
      } else if (fullName.trim().length < 2) {
        errors.fullName = "Full name must be at least 2 characters long"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithGoogle()
      if (result.error) {
        setError(result.error)
      } else {
        setSuccessMessage("Redirecting to Google for authentication...")
        setMode("success")
        // Google OAuth will redirect, so we don't need to close manually
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      if (mode === "demo") {
        const result = await signIn(email, password)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccessMessage("Welcome back! You have been signed in successfully.")
          setMode("success")
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      } else if (mode === "signup") {
        const result = await signUp(email, password, fullName)
        if (result.error) {
          setError(result.error)
        } else {
          setSuccessMessage("Account created successfully! You have been signed in and can start using the platform.")
          setMode("success")
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (error) {
      setError("")
    }

    switch (field) {
      case "email":
        setEmail(value)
        break
      case "password":
        setPassword(value)
        break
      case "fullName":
        setFullName(value)
        break
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "oauth":
        return "Welcome to Alexzo"
      case "demo":
        return "Demo Mode"
      case "signup":
        return "Create Demo Account"
      case "success":
        return "Success!"
      default:
        return "Authentication"
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case "oauth":
        return "Sign in with your Google account to continue"
      case "demo":
        return "Demo mode - sign in with email and password"
      case "signup":
        return "Create a demo account to get started"
      case "success":
        return successMessage
      default:
        return ""
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          <div className="relative p-6 pb-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <SafeImage
                  src="/logo.png"
                  alt="Alexzo Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  fallbackText="A"
                />
              </div>
              <span className="text-lg font-bold text-white">Alexzo</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
              <p className="text-gray-400">{getSubtitle()}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            {mode === "success" ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-300">{successMessage}</p>
              </motion.div>
            ) : mode === "oauth" ? (
              <div className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
                      Connecting to Google...
                    </div>
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Or try demo mode</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("demo")}
                    className="text-purple-400 hover:text-purple-300 p-0"
                    disabled={loading}
                  >
                    Use demo login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode("oauth")}
                    className="text-purple-400 hover:text-purple-300 p-0 text-sm"
                    disabled={loading}
                  >
                    ← Back to Google sign-in
                  </Button>
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                        validationErrors.fullName ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                    {validationErrors.fullName && <p className="text-red-400 text-sm">{validationErrors.fullName}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                      validationErrors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                  {validationErrors.email && <p className="text-red-400 text-sm">{validationErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                      validationErrors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  {validationErrors.password && <p className="text-red-400 text-sm">{validationErrors.password}</p>}
                  {!validationErrors.password && mode === "signup" && (
                    <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === "demo" ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    <>
                      {mode === "demo" ? "Sign In (Demo)" : "Create Demo Account"}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  {mode === "demo" && (
                    <p className="text-gray-400 text-sm">
                      {"Don't have a demo account? "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode("signup")}
                        className="text-purple-400 hover:text-purple-300 p-0"
                        disabled={loading}
                      >
                        Create one
                      </Button>
                    </p>
                  )}

                  {mode === "signup" && (
                    <p className="text-gray-400 text-sm">
                      Already have a demo account?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode("demo")}
                        className="text-purple-400 hover:text-purple-300 p-0"
                        disabled={loading}
                      >
                        Sign in
                      </Button>
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
