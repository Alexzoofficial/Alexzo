"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/proxy/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        setMessage("Successfully subscribed to our newsletter!")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest AI innovations, product updates, and industry insights from Alexzo.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter Subscription
            </CardTitle>
            <CardDescription>Get weekly updates delivered to your inbox</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">What You'll Get</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Latest developments in artificial intelligence and machine learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">New features, improvements, and announcements from our products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry News</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Curated news and trends from the tech and AI industry</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary">Weekly Updates</Badge>
            <Badge variant="secondary">No Spam</Badge>
            <Badge variant="secondary">Unsubscribe Anytime</Badge>
            <Badge variant="secondary">Free Forever</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            We respect your privacy. Your email will never be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
