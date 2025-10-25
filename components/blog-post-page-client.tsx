"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, ArrowRight, Github, Youtube, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { blogPosts } from "@/lib/blog-data"

// Using centralized blog data from lib/blog-data.ts

export default function BlogPostPageClient({ id }: { id: string }) {
  const post = blogPosts.find((p) => p.id === id)
  const relatedPost = post ? blogPosts.find((p) => p.id !== id) : null

  // Extract "About the Author" section from content if it exists
  const aboutAuthorMatch = post?.content.match(/\*\*About the Author\*\*:([\s\S]+?)(?=\n\n|$)/)
  const aboutAuthorText = aboutAuthorMatch ? aboutAuthorMatch[1].trim() : null

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
      <header className="relative z-50 p-4 md:p-6 flex justify-between items-center border-b border-gray-800/50">
        <Button variant="ghost" asChild className="text-white hover:bg-gray-800">
          <Link href="/blog" prefetch={false}>
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
            <Badge className="bg-purple-600 text-white mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">{post.excerpt}</p>
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
          <div className="aspect-video relative overflow-hidden rounded-xl mb-8">
            <SafeImage
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              fallbackSrc="/placeholder.svg?height=400&width=800&text=Blog+Image"
              fallbackText="Blog Image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-purple-600 text-white mb-2">
                {post.category}
              </Badge>
              <p className="text-sm text-white/90 font-medium">
                Featured Article
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
                {post.content.split("\n\n").map((paragraph: string, index: number) => {
                  if (paragraph.startsWith("# ")) {
                    // Skip the first H1 if it matches the post title to avoid duplication
                    const heading = paragraph.replace("# ", "")
                    if (heading === post.title) {
                      return null
                    }
                    return (
                      <h1 key={index} className="text-3xl md:text-4xl font-bold text-white mt-8 mb-6 first:mt-0">
                        {heading}
                      </h1>
                    )
                  } else if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
                        {paragraph.replace("## ", "")}
                      </h2>
                    )
                  } else if (paragraph.startsWith("### ")) {
                    return (
                      <h3 key={index} className="text-xl md:text-2xl font-bold text-white mt-6 mb-3">
                        {paragraph.replace("### ", "")}
                      </h3>
                    )
                  } else if (paragraph.startsWith("**") && paragraph.includes(":")) {
                    const parts = paragraph.split(': ')
                    const title = parts[0].replace(/\*\*/g, '')
                    const content = parts.slice(1).join(': ')
                    // Skip "About the Author" as it's rendered separately below
                    if (title === "About the Author") {
                      return null
                    }
                    return (
                      <div key={index} className="mb-4">
                        <h4 className="text-lg font-bold text-purple-300 mb-2">{title}</h4>
                        <p className="text-gray-300 leading-relaxed">{content}</p>
                      </div>
                    )
                  } else if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n").filter((item) => item.startsWith("- "))
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                        {items.map((item, itemIndex) => {
                          const content = item.replace("- ", "")
                          const parts = content.split(': ')
                          if (parts.length > 1 && parts[0].includes('**')) {
                            const title = parts[0].replace(/\*\*/g, '')
                            const desc = parts.slice(1).join(': ')
                            return (
                              <li key={itemIndex} className="leading-relaxed">
                                <span className="font-semibold text-purple-300">{title}</span>: {desc}
                              </li>
                            )
                          } else {
                            return (
                              <li key={itemIndex} className="leading-relaxed">
                                {content}
                              </li>
                            )
                          }
                        })}
                      </ul>
                    )
                  } else if (paragraph.match(/^\d+\. /)) {
                    const items = paragraph.split("\n").filter((item) => item.match(/^\d+\. /))
                    return (
                      <ol key={index} className="list-decimal list-inside space-y-2 mb-6 text-gray-300">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="leading-relaxed">
                            {item.replace(/^\d+\. /, "")}
                          </li>
                        ))}
                      </ol>
                    )
                  } else if (paragraph.trim().length > 0) {
                    // Handle inline bold and italic formatting
                    const renderFormattedText = (text: string) => {
                      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
                        } else if (part.startsWith('*') && part.endsWith('*')) {
                          return <em key={i} className="italic">{part.slice(1, -1)}</em>
                        }
                        return part
                      })
                    }
                    return (
                      <p key={index} className="text-gray-300 leading-relaxed mb-6">
                        {renderFormattedText(paragraph)}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About the Author Section */}
        {aboutAuthorText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  About the Author
                </h3>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <SafeImage
                      src="/logo.png"
                      alt="Alexzo Logo"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                      fallbackText="Alexzo"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">{post.author}</h4>
                    <p className="text-gray-400 leading-relaxed mb-4">{aboutAuthorText}</p>
                    <div className="flex items-center gap-4">
                      <Link 
                        href="https://github.com/Alexzoofficial" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5" />
                      </Link>
                      <Link 
                        href="https://youtube.com/@alexzoofficial" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-5 w-5" />
                      </Link>
                      <Link 
                        href="https://www.instagram.com/alexzoofficial" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </Link>
                      <Link 
                        href="https://x.com/Alexzoofficial" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="X (Twitter)"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Related Post */}
        {relatedPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">More Articles</h3>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <SafeImage
                  src={relatedPost.image}
                  alt={relatedPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/placeholder.svg?height=300&width=600&text=Related+Post"
                  fallbackText="Related Post Image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 text-white">
                    {relatedPost.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <Badge className="bg-purple-600 text-white mb-3">{relatedPost.category}</Badge>
                <h4 className="font-semibold text-white text-lg mb-3 group-hover:text-purple-300 transition-colors">
                  {relatedPost.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(relatedPost.publishedAt).toLocaleDateString()}
                  </div>
                  <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Link href={`/blog/${relatedPost.id}`} prefetch={false}>
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
