"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, Sparkles, Zap, Globe } from "lucide-react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
      } else {
        setError(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to Alexzo!</CardTitle>
            <CardDescription>
              You've successfully subscribed to our newsletter. Get ready for amazing AI insights!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Check your email for a confirmation message and your first newsletter.
            </p>
            <Button onClick={() => (window.location.href = "/blog")} className="w-full">
              Explore Our Blog
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Mail className="w-4 h-4 mr-2" />
              Newsletter
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Stay Ahead with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Insights
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the latest AI breakthroughs, product updates, and exclusive insights delivered to your inbox every
              week.
            </p>
          </div>

          {/* Subscription Form */}
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle>Subscribe Now</CardTitle>
              <CardDescription>Join thousands of AI enthusiasts and professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Sparkles className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">AI Breakthroughs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Latest developments in artificial intelligence, machine learning, and neural networks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Product Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  First access to new features, tools, and improvements to our AI platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Industry Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Expert analysis on AI trends, market developments, and future predictions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-6">Join Our Growing Community</h3>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-muted-foreground">Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-muted-foreground">Open Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">Weekly</div>
                <div className="text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
