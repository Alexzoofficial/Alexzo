"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Sparkles, Wand2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function TryPage() {
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      // Using Pollinations AI for image generation without watermarks
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`
      setGeneratedImage(imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    if (generatedImage) {
      try {
        // Fetch the image as a blob
        const response = await fetch(generatedImage)
        const blob = await response.blob()

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob)

        // Create and trigger download
        const link = document.createElement("a")
        link.href = url
        link.download = `zyfoox-generated-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()

        // Clean up
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error downloading image:", error)
        // Fallback: open image in new tab
        window.open(generatedImage, "_blank")
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
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
            <span className="text-xl font-bold">Zyfoox Platform</span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Zyfoox
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Transform your ideas into stunning visuals with AI-powered image generation
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Wand2 className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">Create Your Image</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Describe your image in detail</label>
                    <Textarea
                      placeholder="A futuristic cityscape at sunset with flying cars, neon lights reflecting on wet streets, cyberpunk aesthetic, highly detailed, photorealistic, 8K resolution..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[120px] resize-y"
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Generating with Zyfoox...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generate with Zyfoox
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Tips for better results:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Be specific about style, colors, and mood</li>
                    <li>• Include details about lighting and composition</li>
                    <li>• Mention artistic styles (e.g., "digital art", "photorealistic")</li>
                    <li>• Use descriptive adjectives and technical terms</li>
                    <li>• Specify image quality (e.g., "4K", "highly detailed")</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Generated Image</h2>
                  {generatedImage && (
                    <Button
                      onClick={downloadImage}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="aspect-square bg-gray-800/50 rounded-lg flex items-center justify-center overflow-hidden">
                  {generatedImage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated image"
                        width={512}
                        height={512}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </motion.div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Your generated image will appear here</p>
                    </div>
                  )}
                </div>

                {prompt && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Prompt:</span> {prompt}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
