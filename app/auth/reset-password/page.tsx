"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Info, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <SafeImage
                  src="https://alexzo.vercel.app/logo.png"
                  alt="Alexzo Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  fallbackText="A"
                />
              </div>
              <span className="text-lg font-bold text-white">Alexzo</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Password Recovery
            </CardTitle>
            <p className="text-gray-400 mt-2">
              We use Google authentication for enhanced security
            </p>
          </CardHeader>

          <CardContent>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Secure Authentication</h3>
                  <p className="text-gray-300 text-sm">
                    Alexzo uses Google OAuth for authentication, which means password recovery is handled securely by Google.
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-blue-400 font-medium text-sm">How to recover your account:</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Sign in with Google on the main page</li>
                      <li>• If you forgot your Google password, use Google's recovery options</li>
                      <li>• Your Alexzo account is linked to your Google account</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Sign In
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open('https://accounts.google.com/signin/recovery', '_blank')}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Google Account Recovery
                </Button>
              </div>

              <div className="text-center">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white text-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}