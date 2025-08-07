"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const blogPosts = [
  {
    id: "ai-image-generation",
    title: "Revolutionary AI Image Generation: The Future of Digital Art",
    excerpt: "Discover how our advanced AI model is transforming digital art creation with unprecedented quality, speed, and creativity. Generate stunning images from simple text descriptions.",
    content: `Our AI image generation technology represents a breakthrough in artificial intelligence and digital art creation. Using advanced neural networks and machine learning algorithms, we've created a system that can generate high-quality, photorealistic images from simple text descriptions.

## Key Features

**Photorealistic Quality**: Our AI model produces images with incredible detail and realism, rivaling professional photography and digital art.

**Lightning Fast**: Generate stunning images in seconds, not hours. Our optimized infrastructure ensures rapid processing.

**Unlimited Creativity**: From landscapes to portraits, abstract art to technical diagrams - there are no limits to what you can create.

**Free to Use**: No subscriptions, no credits, no limitations. Create as many images as you want, completely free.

## How It Works

Our AI model uses advanced diffusion techniques combined with transformer architectures to understand and interpret text prompts. The system has been trained on millions of high-quality images to understand artistic styles, composition, lighting, and visual elements.

## Use Cases

- **Digital Marketing**: Create unique visuals for campaigns and social media
- **Content Creation**: Generate illustrations for blogs, articles, and presentations  
- **Art and Design**: Explore new creative possibilities and artistic styles
- **Product Development**: Visualize concepts and prototypes quickly
- **Education**: Create educational materials and visual aids

## Getting Started

1. Sign up for your free account
2. Generate your API key
3. Start creating with simple text prompts
4. Download and use your generated images

The future of digital art is here, and it's accessible to everyone.`,
    image: "/images/blog/ai-image-generation.png",
    author: "Alexzo AI Team",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    category: "AI Technology",
    tags: ["AI", "Image Generation", "Digital Art", "Technology", "Innovation"]
  },
  {
    id: "learnflow-2.0",
    title: "LearnFlow 2.0: Next-Generation AI-Powered Learning Platform",
    excerpt: "Experience the future of education with LearnFlow 2.0. Advanced AI algorithms, personalized learning paths, and adaptive content delivery for optimal learning outcomes.",
    content: `LearnFlow 2.0 represents the next evolution in AI-powered education technology. Our completely redesigned platform combines cutting-edge artificial intelligence with proven educational methodologies to create the most effective learning experience possible.

## What's New in LearnFlow 2.0

**Advanced AI Personalization**: Our new AI engine analyzes your learning patterns, strengths, and areas for improvement to create truly personalized learning experiences.

**Adaptive Content Delivery**: Content difficulty and pacing automatically adjust based on your performance and learning speed.

**Interactive Learning Modules**: Engaging multimedia content including videos, interactive exercises, quizzes, and hands-on projects.

**Real-time Progress Analytics**: Detailed insights into your learning journey with actionable recommendations for improvement.

**Multi-Platform Sync**: Seamlessly continue your learning across desktop, tablet, and mobile devices.

## Key Features

- **Smart Learning Paths**: AI-generated curricula tailored to your goals and current skill level
- **Instant Feedback**: Get immediate feedback on exercises and assessments
- **Collaborative Learning**: Connect with peers and mentors in your learning community
- **Offline Mode**: Download content for learning without internet connection
- **Progress Tracking**: Comprehensive analytics and achievement system

## Educational Impact

Students using LearnFlow 2.0 have shown remarkable improvements:
- 45% faster learning progression
- 92% course completion rate
- 38% better retention of learned material
- 95% user satisfaction rating

## Supported Subjects

- Programming and Software Development
- Data Science and Machine Learning
- Digital Marketing and Business
- Design and Creative Arts
- Languages and Communication
- Science and Mathematics

## AI-Powered Features

**Intelligent Tutoring**: Get personalized help and explanations when you're stuck
**Adaptive Testing**: Assessments that adjust difficulty based on your responses
**Learning Style Recognition**: AI identifies how you learn best and optimizes content accordingly
**Predictive Analytics**: Anticipate learning challenges before they become obstacles

## Getting Started with LearnFlow 2.0

1. Download the app from our website
2. Complete the AI-powered skill assessment
3. Receive your personalized learning plan
4. Start your journey to mastery

LearnFlow 2.0 is more than just an educational app - it's your personal AI learning companion, designed to help you achieve your goals faster and more effectively than ever before.

Available now for free download with premium features for advanced learners.`,
    image: "/images/blog/learnflow-2.0.png",
    author: "LearnFlow Development Team",
    publishedAt: "2024-01-10",
    readTime: "12 min read",
    category: "Education Technology",
    tags: ["LearnFlow", "Education", "AI Learning", "Version 2.0", "Personalized Learning"]
  }
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(blogPosts.map(post => post.category)))
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background - Same as home page */}
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
      <header className="relative z-50 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800/50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="text-white hover:bg-gray-800">
            <Link href="/">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              <Image
                src="/logo.png"
                alt="Alexzo Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Blog
            </h1>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-300 border-purple-300/50 bg-purple-900/20">
          {blogPosts.length} Articles
        </Badge>
      </header>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Hero Section - Same style as home page */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Latest Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the latest innovations in AI technology and educational platforms. Deep insights into our revolutionary products and their impact on the future.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            >
              All Articles
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 h-full group overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-purple-300">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {post.category}
                      </h3>
                      <p className="text-sm text-gray-300">
                        Featured Article
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600 text-white">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-xl md:text-2xl leading-tight group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-gray-300 text-base leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      
                      <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link href={`/blog/${post.id}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Same style as home page */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-20 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Stay Updated</h3>
              <p className="text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Get the latest insights on AI technology, educational innovations, and product updates delivered directly to your inbox.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold w-full sm:w-auto" asChild>
                <Link href="/#newsletter">
                  Subscribe to Newsletter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
