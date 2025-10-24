"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ImageIcon, Star, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"

export default function ProductsPage() {
  const products = [
    {
      id: "zyfoox",
      name: "Zyfoox",
      tagline: "AI-Powered Image Generation",
      description:
        "Revolutionary AI-powered image generation tool that transforms text descriptions into stunning visuals using advanced neural networks. Create professional-quality images instantly without watermarks or API requirements.",
      status: "Available Now",
      features: [
        "Text-to-Image Generation",
        "Advanced AI Models",
        "No Watermarks",
        "Instant Generation",
        "High-Quality Output",
        "Professional Results",
      ],
      stats: { users: "25K+", rating: 4.9, growth: "+350%" },
      color: "purple",
      link: "/try",
    },
    {
      id: "learnflow",
      name: "LearnFlow",
      tagline: "AI-Powered Learning Platform",
      description:
        "Revolutionary educational app that transforms learning through AI-powered personalization, adaptive content delivery, and intelligent progress tracking. Download our mobile app for an immersive learning experience.",
      status: "Available Now",
      features: [
        "Personalized Learning Paths",
        "AI-Powered Content",
        "Progress Tracking",
        "Interactive Lessons",
        "Offline Learning",
        "Multi-Platform Support",
      ],
      stats: { users: "50K+", rating: 4.8, growth: "+420%" },
      color: "blue",
      link: "/LearnFlow", // Changed from /learnflow to /LearnFlow
    },
  ]

  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Alexzo AI Products - Zyfoox Image Generator",
    description:
      "Revolutionary AI-powered image generation tool Zyfoox using advanced neural networks for professional image creation",
    url: "https://alexzo.netlify.app/products",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: product.name,
        description: product.description,
        applicationCategory: "AI Image Generator",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.stats.rating,
          ratingCount: "2500",
        },
      },
    })),
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Script
        id="products-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsStructuredData) }}
      />

      {/* Geometric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
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
            <span className="text-xl font-bold">Alexzo</span>
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Our AI Products
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our revolutionary AI-powered image generation tool designed to transform your creative ideas into
              reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-${product.color}-500/20 flex items-center justify-center`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <ImageIcon className={`h-8 w-8 text-${product.color}-400`} />
                      </motion.div>
                      <div>
                        <Link href={product.link} className="block group-hover:text-purple-300 transition-colors">
                          <h3 className="text-2xl font-bold cursor-pointer">{product.name}</h3>
                        </Link>
                        <p className="text-gray-400">{product.tagline}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">{product.status}</Badge>
                  </div>

                  {/* Product Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                          <div className={`w-2 h-2 rounded-full bg-${product.color}-400`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Users</span>
                      </div>
                      <span className="font-bold">{product.stats.users}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Rating</span>
                      </div>
                      <span className="font-bold">{product.stats.rating}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">Growth</span>
                      </div>
                      <span className="font-bold">{product.stats.growth}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => (window.location.href = product.link)}
                    >
                      Try Now
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
