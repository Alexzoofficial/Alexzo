"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [mode, setMode] = useState<"oauth">("oauth")
  const [showRedirectOption, setShowRedirectOption] = useState(false)

  const { signInWithGoogle, isFirebaseConfigured } = useAuth()
  
  console.log("AuthModal render - isOpen:", isOpen, "isFirebaseConfigured:", isFirebaseConfigured)

  useEffect(() => {
    if (isOpen) {
      setMode("oauth")
      setError("")
      setSuccessMessage("")
      setLoading(false)
      setShowRedirectOption(false)
    }
  }, [isOpen])

  const handleGoogleSignIn = async (useRedirect = false) => {
    setLoading(true)
    setError("")
    setShowRedirectOption(false)

    try {
      console.log("Starting Google OAuth flow...", useRedirect ? 'with redirect' : 'with popup')
      const result = await signInWithGoogle(useRedirect)
      console.log("Google OAuth result:", result)
      
      if (result.error) {
        console.error("Google OAuth error:", result.error)
        
        // Check if popup was blocked
        if ((result as any).popupBlocked) {
          setError(result.error)
          setShowRedirectOption(true)
        } else {
          setError(result.error)
        }
        setLoading(false)
      } else if (result.success) {
        console.log("Google OAuth successful!")
        
        if (useRedirect) {
          // For redirect, the page will reload automatically
          setSuccessMessage("Redirecting to Google...")
        } else {
          setLoading(false)
          setSuccessMessage("Welcome! You've been successfully signed in.")
          
          // Close modal and redirect to home after showing success message
          setTimeout(() => {
            onClose()
            window.location.href = "/"
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Authentication failed. Please try again.")
      setLoading(false)
    }
  }

  const getTitle = () => {
    return "Welcome to Alexzo"
  }

  const getSubtitle = () => {
    return "Ready to get started!"
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

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                      <p className="text-gray-400">{successMessage}</p>
                    </div>
                  </motion.div>
                )}


                {!successMessage && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleGoogleSignIn(false)}
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

                    {showRedirectOption && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-2">
                            Pop-up blocked? Try this alternative:
                          </p>
                          <Button
                            onClick={() => handleGoogleSignIn(true)}
                            variant="outline"
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white border-gray-600 flex items-center justify-center gap-3 py-3"
                            disabled={loading}
                          >
                            <GoogleIcon />
                            Sign in with redirect
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <p className="text-gray-400 text-xs">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}