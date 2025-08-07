"use client"

import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { AdaptiveAnimation } from "@/components/adaptive-animation"
import { blogPosts } from "@/lib/blog-data"

interface PressArticlePageProps {
  params: {
    id: string
  }
}

export default function PressArticlePage({ params }: PressArticlePageProps) {
  redirect(`/blog/${params.id}`)

  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    // This part will never be reached due to the redirect above
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
        <Link href="/press" className="flex items-center space-x-4">
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
            <span className="text-xl font-bold">Back to Press</span>
          </div>
        </Link>
      </header>

      {/* Article Content */}
      <article className="relative z-10 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <AdaptiveAnimation>
            <div className="mb-8">
              <Badge className="bg-purple-600 mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>
              <div className="flex items-center space-x-6 text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </AdaptiveAnimation>

          <AdaptiveAnimation delay={200}>
            <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </AdaptiveAnimation>

          <AdaptiveAnimation delay={400}>
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="mb-8">
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="AI Neural Network Visualization"
                  width={600}
                  height={300}
                  className="w-full rounded-lg mb-6"
                />
              </div>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="my-8">
                <Image
                  src="/placeholder.svg?height=250&width=500"
                  alt="Cognitive Enhancement Interface"
                  width={500}
                  height={250}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </AdaptiveAnimation>

          <AdaptiveAnimation delay={600}>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AdaptiveAnimation>
        </div>
      </article>
    </div>
  )
}
