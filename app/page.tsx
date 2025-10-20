"use client"

import type React from "react"
import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Brain, Zap, Target, ArrowRight, Sparkles, Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { AuthModal } from "@/components/auth-modal"
import { UserAvatar } from "@/components/user-avatar"
import { SafeImage } from "@/components/safe-image"
import { useAuth } from "@/lib/auth-context"
import { getSiteUrl } from "@/lib/site-url"
import Script from "next/script"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "forgot">("login")
  const { user } = useAuth()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        console.log("Newsletter subscription successful")
      } else {
        console.error("Newsletter subscription failed")
        setEmail("")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setEmail("")
    }
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleGetStarted = () => {
    console.log("Get Started clicked! User state:", user)
    console.log("Current showAuthModal state:", showAuthModal)
    
    if (user) {
      console.log("User exists, scrolling to products")
      scrollToProducts()
    } else {
      console.log("No user, opening auth modal")
      setAuthModalMode("login")
      setShowAuthModal(true)
      console.log("Auth modal should now be visible")
    }
  }

  const siteUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : getSiteUrl()

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Alexzo",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        description:
          "Alexzo – Unlock creativity, master learning, and enhance cognition with AI tools like Zyfoox and LearnFlow.",
        foundingDate: "2025",
        founders: [
          {
            "@type": "Person",
            name: "Sar",
          },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "alexzomail@proton.me",
          contactType: "customer service",
        },
        sameAs: [
          siteUrl,
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "15000",
          bestRating: "5",
          worstRating: "1"
        },
        knowsAbout: ["Artificial Intelligence", "Machine Learning", "Educational Technology", "Image Generation", "Cognitive Enhancement"],
        areaServed: "Worldwide",
        numberOfEmployees: "1-10"
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Alexzo - AI-Powered Human Enhancement Platform",
        description: "Alexzo – Unlock creativity, master learning, and enhance cognition with AI tools like Zyfoox and LearnFlow.",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "en-US",
        copyrightYear: "2025",
        copyrightHolder: {
          "@id": `${siteUrl}/#organization`
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#zyfoox`,
        name: "Zyfoox AI Image Generator",
        description: "Revolutionary AI-powered image generation tool that transforms creative ideas into stunning visuals instantly.",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        publisher: {
          "@id": `${siteUrl}/#organization`
        },
        url: `${siteUrl}/try/zyfoox`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "5000",
          bestRating: "5"
        }
      },
      {
        "@type": "MobileApplication",
        "@id": `${siteUrl}/#learnflow`,
        name: "LearnFlow 2.0",
        description: "Revolutionary AI-powered educational app that transforms learning through personalized content and adaptive lessons.",
        applicationCategory: "EducationalApplication",
        operatingSystem: ["Android", "iOS", "Windows", "macOS"],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        publisher: {
          "@id": `${siteUrl}/#organization`
        },
        url: `${siteUrl}/LearnFlow`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "15000",
          bestRating: "5"
        },
        downloadUrl: "https://rb.gy/sap9gf"
      }
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <SafeImage
              src={`${siteUrl}/logo.png`}
              alt="Alexzo Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
              fallbackText="Alexzo"
            />
          </div>
        </motion.div>

        <nav className="hidden md:flex space-x-8">
          <button onClick={scrollToProducts} className="hover:text-purple-400 transition-colors">
            Products
          </button>
          <Link href="/blog" className="hover:text-purple-400 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-purple-400 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-purple-400 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <UserAvatar />
          ) : (
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <AdaptiveAnimation>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Alexzo
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Pioneering the Future of AI-Powered Human Enhancement
            </p>
          </AdaptiveAnimation>

          <AdaptiveAnimation delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4"
                onClick={scrollToProducts}
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 bg-transparent"
                asChild
              >
                <Link href="/blog">
                  <Play className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>
          </AdaptiveAnimation>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="cursor-pointer"
            onClick={scrollToProducts}
          >
            <ChevronDown className="h-8 w-8 mx-auto text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Revolutionary AI Features</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the future of human enhancement with our cutting-edge AI technology
              </p>
            </div>
          </AdaptiveAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Neural Enhancement",
                description: "Advanced AI algorithms that adapt to your learning patterns",
                color: "purple",
              },
              {
                icon: Zap,
                title: "Instant Insights",
                description: "Real-time analysis and personalized recommendations",
                color: "blue",
              },
              {
                icon: Target,
                title: "Precision Training",
                description: "Targeted exercises designed for maximum cognitive impact",
                color: "purple",
              },
            ].map((feature, index) => (
              <AdaptiveAnimation key={index} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full group">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${feature.color}-500/20 flex items-center justify-center group-hover:bg-${feature.color}-500/30 transition-colors`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <feature.icon className={`h-8 w-8 text-${feature.color}-400`} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our AI Products</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Discover our revolutionary AI-powered solutions designed to enhance creativity and learning
              </p>
            </div>
          </AdaptiveAnimation>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Zyfoox Product */}
            <AdaptiveAnimation delay={200}>
              <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm mb-4">
                      Featured Product
                    </span>
                    <h3 className="text-3xl font-bold mb-4 text-white">Zyfoox</h3>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                      Revolutionary AI-powered image generation tool that transforms your creative ideas into stunning
                      visuals. Generate professional-quality images instantly from text descriptions.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-4 text-purple-300">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Advanced Text-to-Image Generation",
                        "Professional Quality Output",
                        "No Watermarks or Limitations",
                        "Instant Image Creation",
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1" asChild>
                      <Link href="/try/zyfoox">
                        Try Zyfoox Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                      asChild
                    >
                      <Link href="/blog/1">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AdaptiveAnimation>

            {/* LearnFlow Product */}
            <AdaptiveAnimation delay={400}>
              <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm mb-4">
                      New App
                    </span>
                    <div className="flex items-center space-x-4 mb-4">
                      <SafeImage
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LearnFlowappicon-QFniHopMadVw2rtAO02r8r8itI17Fz.png"
                        alt="LearnFlow App Icon"
                        width={60}
                        height={60}
                        className="rounded-2xl shadow-xl"
                        fallbackText="LF"
                      />
                      <h3 className="text-3xl font-bold text-white">LearnFlow</h3>
                    </div>
                    <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                      Revolutionary AI-powered educational app that transforms learning through personalized content,
                      adaptive lessons, and intelligent progress tracking.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-4 text-blue-300">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "AI-Powered Personalization",
                        "Adaptive Learning Paths",
                        "Progress Analytics",
                        "Interactive Content",
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1" asChild>
                      <Link href="/LearnFlow">
                        Download App
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent"
                      asChild
                    >
                      <Link href="/blog/2">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AdaptiveAnimation>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Innovators Worldwide</h2>
            </div>
          </AdaptiveAnimation>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "75K+", label: "Active Users", icon: Brain },
              { number: "35+", label: "Countries", icon: Target },
              { number: "4.9", label: "User Rating", icon: Sparkles },
              { number: "450%", label: "Growth Rate", icon: Zap },
            ].map((stat, index) => (
              <AdaptiveAnimation key={index} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <h3 className="text-4xl font-bold mb-2 text-purple-300">{stat.number}</h3>
                    <p className="text-gray-300">{stat.label}</p>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-6">
        <AdaptiveAnimation>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-gray-300 mb-8">Get the latest updates on our AI products and upcoming releases</p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 flex-1"
                required
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Subscribe
              </Button>
            </form>
          </div>
        </AdaptiveAnimation>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/50 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <SafeImage
                    src={`${siteUrl}/logo.png`}
                    alt="Alexzo Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    fallbackText="A"
                  />
                </div>
              </div>
              <p className="text-gray-400">Pioneering the future of AI-powered human enhancement</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/try/zyfoox" className="hover:text-white transition-colors">
                    Zyfoox Generator
                  </Link>
                </li>
                <li>
                  <Link href="/LearnFlow" className="hover:text-white transition-colors">
                    LearnFlow App
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Learn More
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
              <div className="mt-4">
                <p className="text-gray-400 mb-2">Email: alexzomail@proton.me</p>
                <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Contact Form
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Alexzo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode={authModalMode} />
    </div>
  )
}
