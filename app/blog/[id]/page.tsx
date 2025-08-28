"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
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

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<any>(null)
  const [relatedPost, setRelatedPost] = useState<any>(null)

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === params.id)
    if (foundPost) {
      setPost(foundPost)
      // Get the other post as related
      const related = blogPosts.find(p => p.id !== params.id)
      setRelatedPost(related)
    }
  }, [params.id])

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

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
      </div>

      {/* Header */}
      <header className="relative z-50 p-4 md:p-6 flex justify-between items-center border-b border-gray-800/50">
        <Button variant="ghost" asChild className="text-white hover:bg-gray-800">
          <Link href="/blog">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </Button>
        <Button variant="ghost" onClick={sharePost} className="text-white hover:bg-gray-800">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </header>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-4xl">
        {/* Article Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <div className="mb-6">
            <Badge className="bg-purple-600 text-white mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime}
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video relative overflow-hidden rounded-xl mb-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-purple-300">
                  {post.title.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {post.category}
              </h3>
              <p className="text-gray-300">
                Featured Article Image
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-12">
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-invert prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph: string, index: number) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={index} className="text-lg font-semibold text-purple-300 mb-4">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    )
                  } else if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.startsWith('- '))
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="leading-relaxed">
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    )
                  } else if (paragraph.trim().length > 0) {
                    return (
                      <p key={index} className="text-gray-300 leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Post */}
        {relatedPost && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">More Articles</h3>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
              <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-300">
                      {relatedPost.title.charAt(0)}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    {relatedPost.category}
                  </h4>
                </div>
              </div>
              <CardContent className="p-6">
                <Badge className="bg-purple-600 text-white mb-3">
                  {relatedPost.category}
                </Badge>
                <h4 className="font-semibold text-white text-lg mb-3 group-hover:text-purple-300 transition-colors">
                  {relatedPost.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {relatedPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(relatedPost.publishedAt).toLocaleDateString()}
                  </div>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href={`/blog/${relatedPost.id}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
