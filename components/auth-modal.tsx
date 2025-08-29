"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
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

const mapDefaultMode = (mode?: "signup" | "login" | "forgot"): "signin" | "signup" | "reset" => {
  switch (mode) {
    case "login":
      return "signin"
    case "forgot":
      return "reset"
    case "signup":
      return "signup"
    default:
      return "signin"
  }
}

export function AuthModal({ isOpen, onClose, initialMode = "signin", defaultMode }: AuthModalProps) {
  const resolvedInitialMode: "signin" | "signup" | "reset" = defaultMode ? mapDefaultMode(defaultMode) : initialMode

  const [mode, setMode] = useState<"signin" | "signup" | "reset" | "success">(resolvedInitialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState("")

  const { signIn, signUp, resetPassword } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setMode(resolvedInitialMode)
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
  }, [isOpen, resolvedInitialMode])

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

    if (mode !== "reset") {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      if (mode === "signin") {
        console.log("Attempting sign in...")
        const result = await signIn(email, password)
        if (result.error) {
          console.error("Sign in error:", result.error)
          setError(result.error)
        } else {
          console.log("Sign in successful")
          setSuccessMessage("Welcome back! You have been signed in successfully.")
          setMode("success")
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      } else if (mode === "signup") {
        console.log("Attempting sign up...")
        const result = await signUp(email, password, fullName)
        if (result.error) {
          console.error("Sign up error:", result.error)
          setError(result.error)
        } else {
          console.log("Sign up successful")
          setSuccessMessage("Account created successfully! You have been signed in and can start using the platform.")
          setMode("success")
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      } else if (mode === "reset") {
        console.log("Attempting password reset...")
        const result = await resetPassword(email)
        if (result.error) {
          console.error("Password reset error:", result.error)
          setError(result.error)
        } else {
          console.log("Password reset successful")
          setSuccessMessage("Password reset instructions have been sent to your email address.")
          setMode("success")
          setTimeout(() => {
            setMode("signin")
          }, 3000)
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
      case "signin":
        return "Welcome Back"
      case "signup":
        return "Create Account"
      case "reset":
        return "Reset Password"
      case "success":
        return "Success!"
      default:
        return "Authentication"
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case "signin":
        return "Sign in to your account to continue"
      case "signup":
        return "Create a new account to get started"
      case "reset":
        return "Enter your email to reset your password"
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
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "reset" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("signin")}
                    className="text-gray-400 hover:text-white mb-4 p-0"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                )}

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                          validationErrors.fullName ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your full name"
                        disabled={loading}
                        autoComplete="name"
                      />
                    </div>
                    {validationErrors.fullName && <p className="text-red-400 text-sm">{validationErrors.fullName}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                        validationErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="Enter your email"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && <p className="text-red-400 text-sm">{validationErrors.email}</p>}
                </div>

                {mode !== "reset" && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 ${
                          validationErrors.password ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your password"
                        disabled={loading}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {validationErrors.password && <p className="text-red-400 text-sm">{validationErrors.password}</p>}
                    {!validationErrors.password && mode === "signup" && (
                      <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                    )}
                  </div>
                )}

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
                      {mode === "signin" && "Signing In..."}
                      {mode === "signup" && "Creating Account..."}
                      {mode === "reset" && "Sending Reset..."}
                    </div>
                  ) : (
                    <>
                      {mode === "signin" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "reset" && "Send Reset Instructions"}
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  {mode === "signin" && (
                    <>
                      <p className="text-gray-400 text-sm">
                        {"Don't have an account? "}
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setMode("signup")}
                          className="text-purple-400 hover:text-purple-300 p-0"
                          disabled={loading}
                        >
                          Sign up
                        </Button>
                      </p>
                      <p className="text-gray-400 text-sm">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setMode("reset")}
                          className="text-purple-400 hover:text-purple-300 p-0"
                          disabled={loading}
                        >
                          Forgot your password?
                        </Button>
                      </p>
                    </>
                  )}

                  {mode === "signup" && (
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode("signin")}
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
