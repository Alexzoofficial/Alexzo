"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  readTime: string
  category: string
  tags: string[]
}

interface BlogPostClientProps {
  post: BlogPost
  relatedPost?: BlogPost
}

export default function BlogPostClient({ post, relatedPost }: BlogPostClientProps) {
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
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback to gradient background if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  parent.className +=
                    " bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center"
                  parent.innerHTML = `
                    <div class="text-center p-8">
                      <div class="w-24 h-24 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="text-4xl font-bold text-purple-300">${post.title.charAt(0)}</span>
                      </div>
                      <h3 class="text-2xl font-semibold text-white mb-4">${post.category}</h3>
                      <p class="text-gray-300">Featured Article Image</p>
                    </div>
                  `
                }
              }}
            />
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
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
                        {paragraph.replace("## ", "")}
                      </h2>
                    )
                  } else if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <p key={index} className="text-lg font-semibold text-purple-300 mb-4">
                        {paragraph.replace(/\*\*/g, "")}
                      </p>
                    )
                  } else if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n").filter((item) => item.startsWith("- "))
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-300">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="leading-relaxed">
                            {item.replace("- ", "")}
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
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <Image
                  src={relatedPost.image || "/placeholder.svg"}
                  alt={relatedPost.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback for related post image
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.className +=
                        " bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center"
                      parent.innerHTML = `
                        <div class="text-center p-6">
                          <div class="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl font-bold text-purple-300">${relatedPost.title.charAt(0)}</span>
                          </div>
                          <h4 class="text-lg font-semibold text-white">${relatedPost.category}</h4>
                        </div>
                      `
                    }
                  }}
                />
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
