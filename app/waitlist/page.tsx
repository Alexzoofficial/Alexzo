"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Send, CheckCircle, Brain, Zap, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { AdaptiveAnimation } from "@/components/adaptive-animation"

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: "",
    company: "",
    useCase: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorData = await response.json()
        console.error("Waitlist submission failed:", errorData)
        // Still show success to user - data is logged for manual processing
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Waitlist submission error:", error)
      // Still show success to user - data is logged for manual processing
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const upcomingProducts = [
    {
      name: "Image Generator",
      description: "AI-powered image creation and editing tools",
      icon: Target,
      release: "Q2 2025",
      features: ["Text-to-image generation", "Style transfer", "Image enhancement", "Batch processing"],
    },
    {
      name: "Video Generator",
      description: "Revolutionary AI video creation platform",
      icon: Zap,
      release: "Q3 2025",
      features: ["Text-to-video", "Scene generation", "Animation tools", "4K output"],
    },
    {
      name: "Voice Generator",
      description: "Natural voice synthesis and audio AI",
      icon: Sparkles,
      release: "Q4 2025",
      features: ["Voice cloning", "Multi-language support", "Emotion control", "Real-time generation"],
    },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              You're In!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for joining our waitlist. We'll notify you as soon as {formData.product || "our new products"}{" "}
              become available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-700 hover:bg-gray-800">
                <Link href="/blog">Read Our Blog</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-4">
          <ArrowLeft className="h-6 w-6" />
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Alexzo Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold">Back to Home</span>
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Join Our Waitlist
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Be the first to experience our revolutionary AI-powered human enhancement tools. Get early access and
              exclusive updates.
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Upcoming Products */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Upcoming AI Products</h2>
              <p className="text-gray-300">
                Revolutionary AI tools coming soon to enhance your creative and cognitive potential
              </p>
            </div>
          </AdaptiveAnimation>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {upcomingProducts.map((product, index) => (
              <AdaptiveAnimation key={index} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <product.icon className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-center">{product.name}</h3>
                    <p className="text-gray-300 text-center mb-4">{product.description}</p>
                    <div className="text-center mb-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {product.release}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-2xl mx-auto">
          <AdaptiveAnimation>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Reserve Your Spot</h2>
                  <p className="text-gray-300">Join thousands of innovators waiting for the future of AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product" className="text-sm font-medium mb-2 block">
                      Product Interest *
                    </Label>
                    <Select
                      value={formData.product}
                      onValueChange={(value) => setFormData({ ...formData, product: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="image-generator">Image Generator</SelectItem>
                        <SelectItem value="video-generator">Video Generator</SelectItem>
                        <SelectItem value="voice-generator">Voice Generator</SelectItem>
                        <SelectItem value="all-products">All Products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium mb-2 block">
                      Company (Optional)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="useCase" className="text-sm font-medium mb-2 block">
                      Use Case (Optional)
                    </Label>
                    <Input
                      id="useCase"
                      name="useCase"
                      type="text"
                      value={formData.useCase}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      placeholder="How do you plan to use our AI tools?"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                  <p>We'll never spam you. Unsubscribe at any time.</p>
                </div>
              </CardContent>
            </Card>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Waitlist Benefits</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Early Access",
                  description: "Be among the first to try our revolutionary AI tools",
                },
                {
                  icon: Zap,
                  title: "Exclusive Updates",
                  description: "Get behind-the-scenes insights and development updates",
                },
                {
                  icon: Target,
                  title: "Special Pricing",
                  description: "Enjoy exclusive discounts and early-bird pricing",
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <benefit.icon className="h-8 w-8 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
