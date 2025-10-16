"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Check, X } from "lucide-react"
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
  aiPlatform: boolean
  imageGen: boolean | "coming" | "limited"
  videoGen: boolean | "coming" | "limited"
  voiceGen: boolean | "coming" | "limited"
}

interface ProductPlan {
  name: string
  price: string
  description: string
  features: string[]
  recommended?: boolean
}

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState("features")

  const productFeatures: ProductFeature[] = [
    {
      name: "Neural Pattern Analysis",
      description: "Advanced analysis of cognitive patterns for personalized enhancement",
      aiPlatform: true,
      imageGen: false,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Personalized Learning",
      description: "Adaptive learning paths based on individual cognitive profiles",
      aiPlatform: true,
      imageGen: false,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Real-time Feedback",
      description: "Immediate feedback on cognitive performance and progress",
      aiPlatform: true,
      imageGen: "limited",
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Text-to-Image Generation",
      description: "Create images from text descriptions using AI",
      aiPlatform: false,
      imageGen: true,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Style Transfer",
      description: "Apply artistic styles to existing images",
      aiPlatform: false,
      imageGen: true,
      videoGen: "limited",
      voiceGen: false,
    },
    {
      name: "Text-to-Video Creation",
      description: "Generate video content from text descriptions",
      aiPlatform: false,
      imageGen: false,
      videoGen: true,
      voiceGen: false,
    },
    {
      name: "Voice Synthesis",
      description: "Generate natural-sounding speech from text",
      aiPlatform: false,
      imageGen: false,
      videoGen: false,
      voiceGen: true,
    },
    {
      name: "Multi-language Support",
      description: "Support for multiple languages across the platform",
      aiPlatform: true,
      imageGen: "coming",
      videoGen: "coming",
      voiceGen: true,
    },
    {
      name: "API Access",
      description: "Programmatic access to AI capabilities",
      aiPlatform: true,
      imageGen: "coming",
      videoGen: "coming",
      voiceGen: "coming",
    },
    {
      name: "Batch Processing",
      description: "Process multiple items simultaneously",
      aiPlatform: true,
      imageGen: true,
      videoGen: "coming",
      voiceGen: true,
    },
  ]

  const productPlans: Record<string, ProductPlan[]> = {
    aiPlatform: [
      {
        name: "Free",
        price: "$0",
        description: "Basic cognitive enhancement features",
        features: [
          "Basic neural pattern analysis",
          "Limited personalized learning",
          "5 training sessions per day",
          "Standard response time",
        ],
      },
      {
        name: "Pro",
        price: "$19.99/mo",
        description: "Advanced features for serious cognitive enhancement",
        features: [
          "Advanced neural pattern analysis",
          "Full personalized learning paths",
          "Unlimited training sessions",
          "Priority response time",
          "Progress analytics dashboard",
        ],
        recommended: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For teams and organizations",
        features: [
          "All Pro features",
          "Team management dashboard",
          "Custom integration options",
          "Dedicated support",
          "Custom training modules",
        ],
      },
    ],
    imageGen: [
      {
        name: "Basic",
        price: "$0",
        description: "Essential image generation features",
        features: ["10 generations per day", "Standard resolution", "Basic styles", "5-second generation time"],
      },
      {
        name: "Creator",
        price: "$14.99/mo",
        description: "For creative professionals and enthusiasts",
        features: [
          "100 generations per day",
          "High resolution output",
          "All style options",
          "2-second generation time",
          "Commercial usage rights",
        ],
        recommended: true,
      },
      {
        name: "Studio",
        price: "$49.99/mo",
        description: "For professional studios and agencies",
        features: [
          "Unlimited generations",
          "Maximum resolution",
          "Priority processing",
          "Batch processing",
          "API access",
        ],
      },
    ],
    videoGen: [
      {
        name: "Coming Soon",
        price: "-",
        description: "Join the waitlist for early access",
        features: [
          "Text-to-video generation",
          "Multiple video styles",
          "Various duration options",
          "HD quality output",
        ],
      },
    ],
    voiceGen: [
      {
        name: "Coming Soon",
        price: "-",
        description: "Join the waitlist for early access",
        features: ["Natural voice synthesis", "Multiple voice options", "Emotion control", "Multi-language support"],
      },
    ],
  }

  const showcaseItems = [
    {
      id: "alexis-ai-demo",
      title: "Alexis AI in Action",
      description: "See how our AI adapts to your learning patterns",
      image: "/images/showcase/alexis-ai-demo.png",
      type: "Interactive Demo",
    },
    {
      id: "neural-analysis",
      title: "Neural Pattern Analysis",
      description: "Real-time cognitive assessment and optimization",
      image: "/images/showcase/neural-analysis.png",
      type: "Technology Preview",
    },
    {
      id: "image-generation",
      title: "AI Image Generation",
      description: "Create stunning visuals from text descriptions",
      image: "/images/showcase/image-generation.png",
      type: "Coming Q2 2025",
    },
    {
      id: "video-creation",
      title: "AI Video Creation",
      description: "Transform ideas into dynamic video content",
      image: "/images/showcase/video-creation.png",
      type: "Coming Q3 2025",
    },
  ]

  const renderFeatureStatus = (status: boolean | "coming" | "limited") => {
    if (status === true) {
      return <Check className="h-5 w-5 text-green-500" />
    } else if (status === "coming") {
      return (
        <div className="flex items-center">
          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-400/20">
            Coming Soon
          </Badge>
        </div>
      )
    } else if (status === "limited") {
      return (
        <div className="flex items-center">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-400/20">
            Limited
          </Badge>
        </div>
      )
    } else {
      return <X className="h-5 w-5 text-gray-400" />
    }
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
                src="https://alexzo.vercel.app/logo.png"
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
          <AdaptiveAnimation>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Product Showcase
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Compare our revolutionary AI products and discover the perfect solution for your needs
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Product Comparison Tabs */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <Tabs defaultValue="features" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="features">Feature Comparison</TabsTrigger>
                <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
                <TabsTrigger value="demos">Product Demos</TabsTrigger>
              </TabsList>

              {/* Features Comparison Tab */}
              <TabsContent value="features" className="space-y-8">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left py-4 px-4 font-medium text-gray-300">Feature</th>
                            <th className="text-center py-4 px-4 font-medium text-purple-400">Alexis AI</th>
                            <th className="text-center py-4 px-4 font-medium text-blue-400">Image Generator</th>
                            <th className="text-center py-4 px-4 font-medium text-green-400">Video Generator</th>
                            <th className="text-center py-4 px-4 font-medium text-yellow-400">Voice Generator</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productFeatures.map((feature, index) => (
                            <tr
                              key={index}
                              className={`${index % 2 === 0 ? "bg-gray-800/20" : ""} hover:bg-gray-800/40`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex flex-col">
                                  <span className="font-medium">{feature.name}</span>
                                  <span className="text-sm text-gray-400">{feature.description}</span>
                                </div>
                              </td>
                              <td className="text-center py-4 px-4">{renderFeatureStatus(feature.aiPlatform)}</td>
                              <td className="text-center py-4 px-4">{renderFeatureStatus(feature.imageGen)}</td>
                              <td className="text-center py-4 px-4">{renderFeatureStatus(feature.videoGen)}</td>
                              <td className="text-center py-4 px-4">{renderFeatureStatus(feature.voiceGen)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-400/20"
                        >
                          Coming Soon
                        </Badge>
                        <span>In development</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-400/20">
                          Limited
                        </Badge>
                        <span>Basic functionality</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <X className="h-4 w-4 text-gray-400" />
                        <span>Not available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Plans Tab */}
              <TabsContent value="pricing" className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(productPlans).map(([productKey, plans]) =>
                    plans.map((plan, planIndex) => (
                      <Card
                        key={`${productKey}-${planIndex}`}
                        className={`bg-gray-900/50 border-gray-800 ${
                          plan.recommended ? "ring-2 ring-purple-500" : ""
                        } h-full`}
                      >
                        <CardContent className="p-6">
                          <div className="mb-4">
                            {plan.recommended && <Badge className="bg-purple-600 mb-2">Recommended</Badge>}
                            <h3 className="text-xl font-bold">
                              {productKey === "aiPlatform" && "AI Platform"}
                              {productKey === "imageGen" && "Image Generator"}
                              {productKey === "videoGen" && "Video Generator"}
                              {productKey === "voiceGen" && "Voice Generator"}
                              {" - "}
                              {plan.name}
                            </h3>
                            <div className="mt-2">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              {plan.price.includes("/mo") && <span className="text-gray-400 ml-1">per month</span>}
                            </div>
                            <p className="text-gray-400 mt-2">{plan.description}</p>
                          </div>
                          <div className="space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6">
                            <Button
                              className={`w-full ${
                                plan.name === "Coming Soon"
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              onClick={() => {
                                if (plan.name === "Coming Soon") {
                                  window.location.href = "/waitlist"
                                } else if (productKey === "aiPlatform") {
                                  window.location.href = "/products"
                                } else {
                                  window.location.href = "/waitlist"
                                }
                              }}
                            >
                              {plan.name === "Coming Soon" ? "Join Waitlist" : "Get Started"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )),
                  )}
                </div>
              </TabsContent>

              {/* Product Demos Tab */}
              <TabsContent value="demos" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {showcaseItems.map((item, index) => (
                    <AdaptiveAnimation key={index} delay={index * 200}>
                      <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="relative h-64 overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute top-4 left-4">
                              <Badge
                                className={`${
                                  item.type.includes("Coming")
                                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                    : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                } backdrop-blur-sm`}
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                              <Button
                                className={`${
                                  item.type.includes("Coming")
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                                onClick={() => {
                                  if (item.type.includes("Coming")) {
                                    window.location.href = "/waitlist"
                                  } else if (item.id === "alexis-ai-demo") {
                                    window.open("https://alexisai.netlify.app/", "_blank")
                                  }
                                }}
                              >
                                {item.type.includes("Coming") ? "Join Waitlist" : "View Demo"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AdaptiveAnimation>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Choose the AI solution that best fits your needs or join our waitlist for upcoming products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => window.open("https://alexisai.netlify.app/", "_blank")}
              >
                Try Alexis AI Now
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
                <Link href="/waitlist">Join Product Waitlist</Link>
              </Button>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
