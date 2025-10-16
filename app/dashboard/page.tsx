"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home screen - no separate dashboard needed
    router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Redirecting to home screen...</div>
    </div>
  )
}