"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Download, Shield, Star, Users, BookOpen, Brain, Target, Zap, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"

export default function LearnFlowPage() {
  const handleDownload = () => {
    window.open("https://rb.gy/sap9gf", "_blank")
  }

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Personalization",
      description: "AI engine analyzes your learning patterns to create truly personalized experiences",
    },
    {
      icon: Target,
      title: "Adaptive Content Delivery",
      description: "Content difficulty and pacing automatically adjust based on your performance",
    },
    {
      icon: BookOpen,
      title: "Interactive Learning Modules",
      description: "Engaging multimedia content with videos, quizzes, and hands-on projects",
    },
    {
      icon: Zap,
      title: "Real-time Progress Analytics",
      description: "Detailed insights into your learning journey with actionable recommendations",
    },
  ]

  const stats = [
    { label: "Active Learners", value: "75K+", icon: Users },
    { label: "Course Completion", value: "92%", icon: Target },
    { label: "App Rating", value: "4.9★", icon: Star },
    { label: "Learning Paths", value: "500+", icon: BookOpen },
  ]

  const improvements = [
    "45% faster learning progression",
    "92% course completion rate", 
    "38% better retention of learned material",
    "95% user satisfaction rating"
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "LearnFlow 2.0",
    description: "Next-generation AI-powered learning platform with advanced personalization, adaptive content delivery, and intelligent progress tracking. Experience the future of education with LearnFlow 2.0.",
    applicationCategory: "EducationalApplication",
    operatingSystem: ["Android", "iOS", "Windows", "macOS"],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "15000",
    },
    downloadUrl: "https://rb.gy/sap9gf",
    version: "2.0",
    keywords: "AI learning, personalized education, adaptive learning, educational technology, LearnFlow 2.0, AI tutoring, smart learning paths",
    author: {
      "@type": "Organization",
      name: "Alexzo",
      url: "https://alexzo.vercel.app"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Script
        id="learnflow-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/20 to-black" />
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
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
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
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <Badge className="bg-blue-500/20 text-blue-300 mb-6">🚀 Next-Generation AI Learning Platform</Badge>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                LearnFlow 2.0
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the future of education with advanced AI personalization, adaptive content delivery, and intelligent progress tracking. 
                LearnFlow 2.0 is your personal AI learning companion designed to help you achieve mastery faster than ever before.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">Download LearnFlow 2.0</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className="truncate">Explore Features</span>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - App Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LearnFlowappicon-QFniHopMadVw2rtAO02r8r8itI17Fz.png"
                    alt="LearnFlow 2.0 App Icon"
                    width={200}
                    height={200}
                    className="rounded-3xl shadow-2xl"
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-full p-3 border border-blue-500/30"
                >
                  <Brain className="h-6 w-6 text-blue-400" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -bottom-4 -left-4 bg-purple-500/20 backdrop-blur-sm rounded-full p-3 border border-purple-500/30"
                >
                  <Target className="h-6 w-6 text-purple-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              What's New in LearnFlow 2.0
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the revolutionary features that make LearnFlow 2.0 the most advanced AI-powered learning platform available today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Impact Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent text-center">
                  Proven Educational Impact
                </h2>
                <p className="text-xl text-gray-300 mb-8 text-center max-w-2xl mx-auto">
                  Students using LearnFlow 2.0 have shown remarkable improvements in learning outcomes:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-lg">{improvement}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Ready to Transform Your Learning Journey?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join over 75,000 learners who are already experiencing the future of education with LearnFlow 2.0's 
                  revolutionary AI-powered platform.
                </p>

                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl w-full sm:w-auto max-w-full"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                  <span className="truncate">Download LearnFlow 2.0 Now</span>
                </Button>

                <div className="flex flex-wrap items-center justify-center mt-6 gap-x-6 gap-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">Secure Download</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">75K+ Users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Link */}
      <section className="relative z-10 py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            By downloading LearnFlow 2.0, you agree to our{" "}
            <Link href="/LearnFlowprivacypolicy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </Link>{" "}
            and Terms of Service. LearnFlow 2.0 - The Future of AI-Powered Education.
          </p>
        </div>
      </section>
    </div>
  )
}
