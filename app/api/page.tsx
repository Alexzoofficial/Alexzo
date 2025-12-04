"use client"

import { ArrowLeft, Code, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function APIPage() {
  const codeExample = `// AI Image Generation - Free Use
const response = await fetch('https://alexzo.vercel.app/api/zyfoox', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over mountains, photorealistic',
    width: 512,
    height: 512
  })
});

const data = await response.json();
console.log(data.data[0].url);`

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
              API
            </h1>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Main Content */}
        <div className="grid gap-8">
          <Card className="bg-gray-900/50 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-6 w-6 mr-3 text-purple-400" />
                API Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-400">
                Here's an example of how to use the AI Image Generation API.
              </p>
              <div className="bg-black rounded-lg p-4">
                <pre>
                  <code className="text-sm text-gray-300">{codeExample}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-6 w-6 mr-3 text-blue-400" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                The API is currently open for free use. No authentication is
                required.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
