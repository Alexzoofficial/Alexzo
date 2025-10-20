"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X, Star, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { AdaptiveAnimation } from "@/components/adaptive-animation"

interface ProductFeature {
  name: string
  description: string
  learnFlow: boolean | "coming"
  zyfoox: boolean | "coming"
}

interface ProductPlan {
  name: string
  price: string
  description: string
  features: string[]
  recommended?: boolean
}

interface Product {
  id: string
  name: string
  tagline: string
  description: string
  status: string
  image: string
  link: string
  stats: {
    users: string
    rating: number
    growth: string
  }
  color: string
}

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const products: Product[] = [
    {
      id: "zyfoox",
      name: "Zyfoox",
      tagline: "AI-Powered Image Generation",
      description:
        "Revolutionary AI-powered image generation tool that transforms text descriptions into stunning visuals using advanced neural networks. Create professional-quality images instantly without watermarks or API requirements.",
      status: "Available Now",
      image: "/images/products/zyfoox-interface.png",
      link: "/try/zyfoox",
      stats: { users: "25K+", rating: 4.9, growth: "+350%" },
      color: "purple",
    },
    {
      id: "learnflow",
      name: "LearnFlow",
      tagline: "AI-Powered Learning Platform",
      description:
        "Revolutionary educational app that transforms learning through AI-powered personalization, adaptive content delivery, and intelligent progress tracking. Download our mobile app for an immersive learning experience.",
      status: "Available Now",
      image: "/images/products/image-generator.png",
      link: "/LearnFlow",
      stats: { users: "50K+", rating: 4.8, growth: "+420%" },
      color: "blue",
    },
  ]

  const productFeatures: ProductFeature[] = [
    {
      name: "AI-Powered Content Generation",
      description: "Advanced AI algorithms for content creation",
      learnFlow: true,
      zyfoox: true,
    },
    {
      name: "Real-time Processing",
      description: "Instant results with lightning-fast processing",
      learnFlow: true,
      zyfoox: true,
    },
    {
      name: "Adaptive Learning Paths",
      description: "Personalized learning journeys based on progress",
      learnFlow: true,
      zyfoox: false,
    },
    {
      name: "Progress Tracking & Analytics",
      description: "Monitor learning progress with detailed insights",
      learnFlow: true,
      zyfoox: false,
    },
    {
      name: "Interactive Assessments",
      description: "Engage with dynamic quizzes and activities",
      learnFlow: true,
      zyfoox: false,
    },
    {
      name: "Text-to-Image Generation",
      description: "Create stunning images from text descriptions",
      learnFlow: false,
      zyfoox: true,
    },
    {
      name: "Multiple Art Styles",
      description: "Choose from various artistic styles and themes",
      learnFlow: false,
      zyfoox: true,
    },
    {
      name: "High-Resolution Output",
      description: "Generate images in professional quality",
      learnFlow: false,
      zyfoox: true,
    },
    {
      name: "No Watermarks",
      description: "Clean, professional output without branding",
      learnFlow: false,
      zyfoox: true,
    },
    {
      name: "Instant Generation",
      description: "Get results in seconds, not minutes",
      learnFlow: false,
      zyfoox: true,
    },
    {
      name: "Multi-language Support",
      description: "Support for multiple languages",
      learnFlow: true,
      zyfoox: "coming",
    },
    {
      name: "API Access",
      description: "Programmatic access to AI capabilities",
      learnFlow: "coming",
      zyfoox: "coming",
    },
  ]

  const productPlans: Record<string, ProductPlan[]> = {
    zyfoox: [
      {
        name: "Free",
        price: "$0",
        description: "Essential image generation features",
        features: [
          "10 generations per day",
          "Standard resolution",
          "Basic art styles",
          "No watermarks",
          "Fast generation",
        ],
      },
      {
        name: "Creator",
        price: "$14.99/mo",
        description: "For creative professionals",
        features: [
          "100 generations per day",
          "High resolution output",
          "All art styles",
          "Priority processing",
          "Commercial usage rights",
          "Advanced customization",
        ],
        recommended: true,
      },
      {
        name: "Studio",
        price: "$49.99/mo",
        description: "For professional studios",
        features: [
          "Unlimited generations",
          "Maximum resolution",
          "Priority processing",
          "Batch processing",
          "API access",
          "Dedicated support",
        ],
      },
    ],
    learnflow: [
      {
        name: "Free",
        price: "$0",
        description: "Start your learning journey",
        features: [
          "Access to basic courses",
          "Limited progress tracking",
          "5 learning sessions per day",
          "Community support",
        ],
      },
      {
        name: "Pro",
        price: "$14.99/mo",
        description: "Advanced learning features",
        features: [
          "Unlimited course access",
          "Advanced analytics",
          "Unlimited sessions",
          "Priority support",
          "Custom learning paths",
          "Offline access",
        ],
        recommended: true,
      },
      {
        name: "Education",
        price: "Custom",
        description: "For schools and institutions",
        features: [
          "All Pro features",
          "Classroom management",
          "Student progress reports",
          "Dedicated support",
          "Custom curriculum",
          "Multi-user management",
        ],
      },
    ],
  }

  const renderFeatureStatus = (status: boolean | "coming") => {
    if (status === true) {
      return <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
    } else if (status === "coming") {
      return (
        <Badge
          variant="outline"
          className="text-[10px] md:text-xs bg-yellow-500/10 text-yellow-400 border-yellow-400/20"
        >
          Soon
        </Badge>
      )
    } else {
      return <X className="h-4 w-4 md:h-5 md:w-5 text-gray-500 flex-shrink-0" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          className="absolute top-10 md:top-20 left-10 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-48 h-48 md:w-64 md:h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 p-4 md:p-6 flex justify-between items-center border-b border-gray-800/50">
        <Link href="/" className="flex items-center space-x-2 md:space-x-4 hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Alexzo Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-base md:text-xl font-bold">Alexzo</span>
          </div>
        </Link>
        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs md:text-sm">
          2 Products Available
        </Badge>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <AdaptiveAnimation>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Product Showcase
            </h1>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Discover our revolutionary AI-powered products designed to transform creativity and learning
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Products Overview Cards */}
      <section className="relative z-10 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
            {products.map((product, index) => (
              <AdaptiveAnimation key={product.id} delay={index * 200}>
                <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48 md:h-64 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 backdrop-blur-sm text-xs md:text-sm">
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h3>
                      <p className="text-sm md:text-base text-purple-400 mb-3">{product.tagline}</p>
                      <p className="text-sm md:text-base text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-5">
                        <div className="text-center p-2 md:p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-3 w-3 md:h-4 md:w-4 text-purple-400 mr-1" />
                            <span className="text-xs md:text-sm font-bold">{product.stats.users}</span>
                          </div>
                          <p className="text-[10px] md:text-xs text-gray-400">Users</p>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 mr-1" />
                            <span className="text-xs md:text-sm font-bold">{product.stats.rating}</span>
                          </div>
                          <p className="text-[10px] md:text-xs text-gray-400">Rating</p>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-400 mr-1" />
                            <span className="text-xs md:text-sm font-bold">{product.stats.growth}</span>
                          </div>
                          <p className="text-[10px] md:text-xs text-gray-400">Growth</p>
                        </div>
                      </div>

                      <Button
                        className={`w-full ${
                          product.color === "purple"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-sm md:text-base`}
                        onClick={() => (window.location.href = product.link)}
                      >
                        Try {product.name} Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AdaptiveAnimation>
            ))}
          </div>

          {/* Detailed Comparison Tabs */}
          <AdaptiveAnimation>
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-8 w-full max-w-2xl mx-auto h-auto">
                <TabsTrigger value="overview" className="text-xs md:text-sm py-2 md:py-3">
                  Features
                </TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs md:text-sm py-2 md:py-3">
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="comparison" className="text-xs md:text-sm py-2 md:py-3 col-span-2 md:col-span-1">
                  Side by Side
                </TabsTrigger>
              </TabsList>

              {/* Features Overview */}
              <TabsContent value="overview" className="space-y-4 md:space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Feature Comparison</h3>
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                      <div className="min-w-[500px] px-4 md:px-0">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="text-left py-3 md:py-4 px-2 md:px-4 font-medium text-gray-300 text-sm md:text-base w-1/2">
                                Feature
                              </th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-blue-400 text-sm md:text-base w-1/4">
                                LearnFlow
                              </th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-purple-400 text-sm md:text-base w-1/4">
                                Zyfoox
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {productFeatures.map((feature, index) => (
                              <tr
                                key={index}
                                className={`${
                                  index % 2 === 0 ? "bg-gray-800/20" : ""
                                } hover:bg-gray-800/40 transition-colors`}
                              >
                                <td className="py-3 md:py-4 px-2 md:px-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-xs md:text-base">{feature.name}</span>
                                    <span className="text-[10px] md:text-sm text-gray-400 mt-1">
                                      {feature.description}
                                    </span>
                                  </div>
                                </td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">
                                  <div className="flex justify-center">
                                    {renderFeatureStatus(feature.learnFlow)}
                                  </div>
                                </td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">
                                  <div className="flex justify-center">
                                    {renderFeatureStatus(feature.zyfoox)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-400/20">
                          Soon
                        </Badge>
                        <span>Coming Soon</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <X className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                        <span>Not Available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Plans */}
              <TabsContent value="pricing" className="space-y-8">
                {Object.entries(productPlans).map(([productKey, plans]) => (
                  <div key={productKey} className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
                      {productKey === "zyfoox" ? "Zyfoox" : "LearnFlow"} Plans
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {plans.map((plan, planIndex) => (
                        <Card
                          key={`${productKey}-${planIndex}`}
                          className={`bg-gray-900/50 border-gray-800 ${
                            plan.recommended ? "ring-2 ring-purple-500 scale-105" : ""
                          } h-full transition-all hover:border-purple-500/50`}
                        >
                          <CardContent className="p-4 md:p-6">
                            <div className="mb-4">
                              {plan.recommended && (
                                <Badge className="bg-purple-600 mb-2 text-xs md:text-sm">Recommended</Badge>
                              )}
                              <h4 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h4>
                              <div className="mt-2">
                                <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
                                {plan.price.includes("/mo") && (
                                  <span className="text-gray-400 ml-1 text-xs md:text-sm">per month</span>
                                )}
                              </div>
                              <p className="text-gray-400 mt-2 text-xs md:text-sm">{plan.description}</p>
                            </div>
                            <div className="space-y-2 md:space-y-3 mb-6">
                              {plan.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start">
                                  <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs md:text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                            <Button
                              className={`w-full ${
                                productKey === "zyfoox"
                                  ? "bg-purple-600 hover:bg-purple-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              } text-sm md:text-base`}
                              onClick={() => {
                                window.location.href = productKey === "zyfoox" ? "/try/zyfoox" : "/LearnFlow"
                              }}
                            >
                              Get Started
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Side by Side Comparison */}
              <TabsContent value="comparison" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold mb-1">{product.name}</h3>
                            <p className="text-xs md:text-sm text-gray-400">{product.tagline}</p>
                          </div>
                          <Badge className={`${
                            product.color === "purple" ? "bg-purple-600/20 text-purple-300 border-purple-500/30" : "bg-blue-600/20 text-blue-300 border-blue-500/30"
                          } text-xs`}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-sm md:text-base text-gray-300 mb-4">{product.description}</p>
                        <div className="space-y-2 mb-4">
                          <h4 className="font-semibold text-sm md:text-base">Key Features:</h4>
                          {productFeatures
                            .filter((f) => f[product.id as keyof ProductFeature] === true)
                            .slice(0, 5)
                            .map((feature, idx) => (
                              <div key={idx} className="flex items-start">
                                <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-xs md:text-sm text-gray-300">{feature.name}</span>
                              </div>
                            ))}
                        </div>
                        <Button
                          className={`w-full ${
                            product.color === "purple"
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-sm md:text-base mt-4`}
                          onClick={() => (window.location.href = product.link)}
                        >
                          Try {product.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 md:py-20 px-4 md:px-6 bg-gradient-to-t from-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 px-4">
              Join 75,000+ users already experiencing the power of AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-sm md:text-base w-full sm:w-auto"
                onClick={() => (window.location.href = "/try/zyfoox")}
              >
                Try Zyfoox Now
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto"
                onClick={() => (window.location.href = "/LearnFlow")}
              >
                Try LearnFlow Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-sm md:text-base w-full sm:w-auto"
                asChild
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
