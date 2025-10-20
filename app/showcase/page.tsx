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
  learnFlow: boolean | "coming" | "limited"
  zyfoox: boolean | "coming" | "limited"
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
      name: "Adaptive Learning Paths",
      description: "Personalized learning journeys based on individual progress",
      learnFlow: true,
      zyfoox: false,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Real-time Progress Tracking",
      description: "Monitor learning progress with detailed analytics",
      learnFlow: true,
      zyfoox: false,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Interactive Assessments",
      description: "Engage with dynamic quizzes and learning activities",
      learnFlow: true,
      zyfoox: false,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "AI Image Generation",
      description: "Create stunning images from text descriptions",
      learnFlow: false,
      zyfoox: true,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Multiple Art Styles",
      description: "Choose from various artistic styles and themes",
      learnFlow: false,
      zyfoox: true,
      videoGen: "limited",
      voiceGen: false,
    },
    {
      name: "High-Resolution Output",
      description: "Generate images in stunning quality",
      learnFlow: false,
      zyfoox: true,
      videoGen: false,
      voiceGen: false,
    },
    {
      name: "Text-to-Video Creation",
      description: "Generate video content from text descriptions",
      learnFlow: false,
      zyfoox: false,
      videoGen: "coming",
      voiceGen: false,
    },
    {
      name: "Voice Synthesis",
      description: "Generate natural-sounding speech from text",
      learnFlow: false,
      zyfoox: false,
      videoGen: false,
      voiceGen: "coming",
    },
    {
      name: "Multi-language Support",
      description: "Support for multiple languages across platforms",
      learnFlow: true,
      zyfoox: "coming",
      videoGen: "coming",
      voiceGen: "coming",
    },
    {
      name: "API Access",
      description: "Programmatic access to AI capabilities",
      learnFlow: "coming",
      zyfoox: "coming",
      videoGen: "coming",
      voiceGen: "coming",
    },
  ]

  const productPlans: Record<string, ProductPlan[]> = {
    learnFlow: [
      {
        name: "Free",
        price: "$0",
        description: "Start your learning journey",
        features: [
          "Access to basic courses",
          "Limited progress tracking",
          "5 learning sessions per day",
          "Standard response time",
        ],
      },
      {
        name: "Pro",
        price: "$14.99/mo",
        description: "Advanced learning features for serious learners",
        features: [
          "Unlimited course access",
          "Advanced progress analytics",
          "Unlimited learning sessions",
          "Priority support",
          "Custom learning paths",
        ],
        recommended: true,
      },
      {
        name: "Education",
        price: "Custom",
        description: "For schools and educational institutions",
        features: [
          "All Pro features",
          "Classroom management tools",
          "Student progress reports",
          "Dedicated support",
          "Custom curriculum integration",
        ],
      },
    ],
    zyfoox: [
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
      id: "learnflow",
      title: "LearnFlow - Adaptive Learning",
      description: "Personalized education powered by AI with real-time progress tracking",
      image: "/images/products/alexis-ai.png",
      type: "Live Platform",
      link: "/LearnFlow",
    },
    {
      id: "zyfoox",
      title: "Zyfoox - AI Image Generator",
      description: "Create stunning visuals from text descriptions with advanced AI",
      image: "/images/products/zyfoox-interface.png",
      type: "Try Now",
      link: "/try/zyfoox",
    },
    {
      id: "image-generator",
      title: "AI Image Generation",
      description: "Transform your ideas into beautiful images instantly",
      image: "/images/products/image-generator.png",
      type: "Available",
      link: "/try/zyfoox",
    },
    {
      id: "video-creation",
      title: "AI Video Creation",
      description: "Transform ideas into dynamic video content",
      image: "/images/products/video-generator.png",
      type: "Coming Q2 2025",
      link: "/waitlist",
    },
  ]

  const renderFeatureStatus = (status: boolean | "coming" | "limited") => {
    if (status === true) {
      return <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
    } else if (status === "coming") {
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-400/20 whitespace-nowrap">
            Coming Soon
          </Badge>
        </div>
      )
    } else if (status === "limited") {
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-400/20 whitespace-nowrap">
            Limited
          </Badge>
        </div>
      )
    } else {
      return <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
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
      <header className="relative z-50 p-4 md:p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 md:space-x-4">
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Alexzo Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg md:text-xl font-bold">Alexzo</span>
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Product Showcase
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Compare our revolutionary AI products and discover the perfect solution for your needs
            </p>
          </AdaptiveAnimation>
        </div>
      </section>

      {/* Product Comparison Tabs */}
      <section className="relative z-10 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <AdaptiveAnimation>
            <Tabs defaultValue="features" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6 md:mb-8 w-full">
                <TabsTrigger value="features" className="text-xs md:text-sm">Features</TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs md:text-sm">Pricing</TabsTrigger>
                <TabsTrigger value="demos" className="text-xs md:text-sm">Demos</TabsTrigger>
              </TabsList>

              {/* Features Comparison Tab */}
              <TabsContent value="features" className="space-y-8">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-3 md:p-6">
                    <div className="overflow-x-auto -mx-3 md:mx-0">
                      <div className="min-w-[640px]">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="text-left py-3 md:py-4 px-2 md:px-4 font-medium text-gray-300 text-sm md:text-base">Feature</th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-purple-400 text-sm md:text-base">LearnFlow</th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-blue-400 text-sm md:text-base">Zyfoox</th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-green-400 text-sm md:text-base">Video Gen</th>
                              <th className="text-center py-3 md:py-4 px-2 md:px-4 font-medium text-yellow-400 text-sm md:text-base">Voice Gen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productFeatures.map((feature, index) => (
                              <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-gray-800/20" : ""} hover:bg-gray-800/40`}
                              >
                                <td className="py-3 md:py-4 px-2 md:px-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm md:text-base">{feature.name}</span>
                                    <span className="text-xs md:text-sm text-gray-400 hidden md:block">{feature.description}</span>
                                  </div>
                                </td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">{renderFeatureStatus(feature.learnFlow)}</td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">{renderFeatureStatus(feature.zyfoox)}</td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">{renderFeatureStatus(feature.videoGen)}</td>
                                <td className="text-center py-3 md:py-4 px-2 md:px-4">{renderFeatureStatus(feature.voiceGen)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
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
                        <X className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                        <span>Not available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Plans Tab */}
              <TabsContent value="pricing" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Object.entries(productPlans).map(([productKey, plans]) =>
                    plans.map((plan, planIndex) => (
                      <Card
                        key={`${productKey}-${planIndex}`}
                        className={`bg-gray-900/50 border-gray-800 ${
                          plan.recommended ? "ring-2 ring-purple-500" : ""
                        } h-full`}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="mb-4">
                            {plan.recommended && <Badge className="bg-purple-600 mb-2 text-xs md:text-sm">Recommended</Badge>}
                            <h3 className="text-lg md:text-xl font-bold">
                              {productKey === "learnFlow" && "LearnFlow"}
                              {productKey === "zyfoox" && "Zyfoox"}
                              {productKey === "videoGen" && "Video Generator"}
                              {productKey === "voiceGen" && "Voice Generator"}
                              {" - "}
                              {plan.name}
                            </h3>
                            <div className="mt-2">
                              <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
                              {plan.price.includes("/mo") && <span className="text-gray-400 ml-1 text-sm md:text-base">per month</span>}
                            </div>
                            <p className="text-gray-400 mt-2 text-sm md:text-base">{plan.description}</p>
                          </div>
                          <div className="space-y-2 md:space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start">
                                <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm md:text-base">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 md:mt-6">
                            <Button
                              className={`w-full text-sm md:text-base ${
                                plan.name === "Coming Soon"
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              onClick={() => {
                                if (plan.name === "Coming Soon") {
                                  window.location.href = "/waitlist"
                                } else if (productKey === "learnFlow") {
                                  window.location.href = "/LearnFlow"
                                } else if (productKey === "zyfoox") {
                                  window.location.href = "/try/zyfoox"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {showcaseItems.map((item, index) => (
                    <AdaptiveAnimation key={index} delay={index * 200}>
                      <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="relative h-48 md:h-64 overflow-hidden">
                            <Image
                              src={item.image}
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
                                } backdrop-blur-sm text-xs md:text-sm`}
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">{item.description}</p>
                              <Button
                                className={`${
                                  item.type.includes("Coming")
                                    ? "bg-gray-700 hover:bg-gray-600"
                                    : "bg-purple-600 hover:bg-purple-700"
                                } text-sm md:text-base`}
                                onClick={() => {
                                  window.location.href = item.link
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
      <section className="relative z-10 py-12 md:py-20 px-4 md:px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <AdaptiveAnimation>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Ready to Experience the Future?</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8">
              Choose the AI solution that best fits your needs or join our waitlist for upcoming products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-sm md:text-base"
                onClick={() => window.location.href = "/LearnFlow"}
              >
                Try LearnFlow Now
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
                onClick={() => window.location.href = "/try/zyfoox"}
              >
                Try Zyfoox Now
              </Button>
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 text-sm md:text-base" asChild>
                <Link href="/waitlist">Join Waitlist</Link>
              </Button>
            </div>
          </AdaptiveAnimation>
        </div>
      </section>
    </div>
  )
}
