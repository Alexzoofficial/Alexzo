"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for auth context to finish loading
        if (authLoading) {
          return
        }

        // Check URL for error parameters
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (error) {
          console.error("OAuth Error:", error, errorDescription)
          setStatus("error")
          setMessage("Authentication failed. Please ensure Google OAuth is enabled in your Supabase project.")
          return
        }

        // Check if user is authenticated
        if (user) {
          setStatus("success")
          setMessage("Authentication successful! Taking you to your dashboard...")
          
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          // Give more time for auth to complete
          setTimeout(() => {
            if (!user && !authLoading) {
              setStatus("error")
              setMessage("Authentication failed. Please ensure Google OAuth is enabled in your Supabase project.")
            }
          }, 3000)
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("Authentication failed. Please try again.")
      }
    }

    handleAuthCallback()
  }, [user, authLoading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-8 text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Processing...</h1>
            <p className="text-gray-400">Please wait while we process your request...</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-4">Success!</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting you to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
            <p className="text-gray-400 mb-6">{message}</p>
            <Button onClick={() => router.push("/")} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Return to Homepage
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
