"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import Image from "next/image"

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    toast.success("Code copied to clipboard!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const apiExample = `// AI Image Generation - Free Use
const response = await fetch('https://alexzo.vercel.app/api/zyfoox', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer alexzo_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over mountains, photorealistic',
    width: 512,
    height: 512
  })
});

const data = await response.json();
console.log(data.data[0].url); // Generated image URL`

  const pythonExample = `import requests
import json

# AI Image Generation with Python
def generate_image(prompt, api_key, width=512, height=512):
    url = "https://alexzo.vercel.app/api/zyfoox"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "prompt": prompt,
        "width": width,
        "height": height
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        result = response.json()
        return result["data"][0]["url"]
    else:
        print(f"Error: {response.json()}")
        return None

# Usage
api_key = "alexzo_your_api_key_here"
prompt = "A futuristic city at sunset, cyberpunk style"
image_url = generate_image(prompt, api_key)

if image_url:
    print(f"Generated image: {image_url}")
    
    # Download the image
    import urllib.request
    urllib.request.urlretrieve(image_url, "generated_image.png")
    print("Image saved as generated_image.png")`

  const curlExample = `# AI Image Generation with cURL
curl -X POST "https://alexzo.vercel.app/api/zyfoox" \\
  -H "Authorization: Bearer alexzo_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A majestic dragon flying over a medieval castle",
    "width": 768,
    "height": 512
  }'`

  const searchApiExample = `// AI-Powered Search - Free Use
const response = await fetch('https://alexzo.vercel.app/api/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer alexzo_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What are the latest advancements in AI?'
  })
});

const data = await response.json();
console.log(data); // Search results`

  const searchPythonExample = `import requests
import json

# AI-Powered Search with Python
def perform_search(query, api_key):
    url = "https://alexzo.vercel.app/api/search"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "query": query
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.json()}")
        return None

# Usage
api_key = "alexzo_your_api_key_here"
query = "Top AI conferences in 2024"
search_results = perform_search(query, api_key)

if search_results:
    print(json.dumps(search_results, indent=2))`

  const searchCurlExample = `# AI-Powered Search with cURL
curl -X POST "https://alexzo.vercel.app/api/search" \\
  -H "Authorization: Bearer alexzo_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Latest trends in machine learning"
  }'`

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
          </div>
        </div>
        <Badge variant="outline" className="text-purple-300 border-purple-300/50 bg-purple-900/20">
          API Documentation
        </Badge>
      </header>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            API Documentation
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our APIs to generate stunning images and perform intelligent searches with the advanced Alexzo AI model. Free to use with no restrictions.
          </p>
        </motion.div>

        {/* Main Documentation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-900/50 border-gray-800 mb-8 md:mb-12 h-12 md:h-14">
              <TabsTrigger value="getting-started" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm">
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="authentication" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm">
                Authentication
              </TabsTrigger>
              <TabsTrigger value="endpoints" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm">
                API Reference
              </TabsTrigger>
              <TabsTrigger value="examples" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm">
                Code Examples
              </TabsTrigger>
              <TabsTrigger value="sdks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-xs md:text-sm">
                SDKs
              </TabsTrigger>
            </TabsList>

            {/* Getting Started */}
            <TabsContent value="getting-started" className="space-y-6 md:space-y-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl md:text-2xl">Welcome to Alexzo AI API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    Our AI image generation API creates stunning, high-quality images from simple text descriptions using the advanced Alexzo AI model. 
                    Completely free to use with no rate limits or restrictions.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-base md:text-lg">Base URL</h4>
                      <code className="text-green-400 bg-gray-900 px-3 py-2 rounded-lg text-xs md:text-sm font-mono break-all">
                        https://alexzo.vercel.app/api
                      </code>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-base md:text-lg">Model</h4>
                      <code className="text-blue-400 bg-gray-900 px-3 py-2 rounded-lg text-xs md:text-sm font-mono">
                        alexzo-ai-v1
                      </code>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 md:p-6">
                    <h4 className="font-semibold mb-4 text-purple-300 text-base md:text-lg">Quick Setup Steps</h4>
                    <ol className="list-decimal list-inside space-y-2 md:space-y-3 text-gray-300 text-sm md:text-base">
                      <li>Create your account and sign in</li>
                      <li>Generate an API key from your API section</li>
                      <li>Include your API key in the Authorization header</li>
                      <li>Make image generation requests to our endpoint</li>
                      <li>Enjoy creating amazing AI-generated images!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mt-6">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">AI-Powered Search</CardTitle>
                    <Badge className="bg-purple-600 text-white px-3 py-1 w-fit">POST</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <p className="text-gray-300 text-base md:text-lg">Get intelligent, real-time search results for any query.</p>

                  <div className="bg-gray-800/50 rounded-xl p-3 md:p-4 font-mono text-sm md:text-base border border-gray-700 overflow-x-auto">
                    <span className="text-purple-400 font-bold">POST</span>{" "}
                    <span className="text-white break-all">https://alexzo.vercel.app/api/search</span>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-300 text-base md:text-lg">Request Parameters</h5>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <code className="text-green-400 bg-gray-900 px-2 py-1 rounded text-xs md:text-sm font-mono">query</code>
                        <Badge variant="outline" className="text-red-300 border-red-300 w-fit">Required</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-1">The search term or question</p>
                      <p className="text-gray-500 text-xs">Type: String</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-300 text-base md:text-lg">Response Format</h5>
                    <div className="bg-gray-900 rounded-xl p-3 md:p-4 border border-gray-700 overflow-x-auto">
                      <pre className="text-xs md:text-sm text-gray-300 font-mono">
{`{
  "results": [
    {
      "title": "...",
      "link": "...",
      "snippet": "..."
    }
  ],
  "related_searches": [
    "..."
  ]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-300 text-base md:text-lg">Example Request (JavaScript)</h5>
                    <div className="bg-gray-900 rounded-xl p-3 md:p-4 border border-gray-700 overflow-x-auto relative">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(searchApiExample, 'gs-js-search')}
                        className="absolute top-2 right-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white h-8 w-8"
                      >
                        {copiedCode === 'gs-js-search' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="text-xs md:text-sm text-gray-300 font-mono pr-10">
                        {searchApiExample}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Authentication */}
            <TabsContent value="authentication" className="space-y-6 md:space-y-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl md:text-2xl">API Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    All API requests require authentication using an API key. Include your API key in the Authorization header of every request.
                  </p>

                  <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
                    <h4 className="font-semibold mb-4 text-purple-300 text-base md:text-lg">API Key Format</h4>
                    <p className="text-gray-300 mb-4 text-sm md:text-base">Your API key starts with <code className="text-green-400 bg-gray-900 px-2 py-1 rounded">alexzo_</code></p>
                    <div className="bg-gray-900 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm border border-gray-700 overflow-x-auto">
                      <div className="text-gray-400 mb-1">// Request Header</div>
                      <div className="break-all">
                        <span className="text-blue-400">Authorization:</span>{" "}
                        <span className="text-green-400">Bearer alexzo_your_api_key_here</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 md:p-6">
                    <h4 className="font-semibold mb-4 text-green-300 text-base md:text-lg">Free & No Restrictions</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
                      <li>No rate limits or usage restrictions</li>
                      <li>No IP blocking or geographical limitations</li>
                      <li>Free image generation requests</li>
                      <li>High-quality results every time</li>
                      <li>24/7 availability with reliable uptime</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Reference */}
            <TabsContent value="endpoints" className="space-y-6 md:space-y-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">Image Generation</CardTitle>
                    <Badge className="bg-purple-600 text-white px-3 py-1 w-fit">POST</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <p className="text-gray-300 text-base md:text-lg">Generate high-quality images from text descriptions using our advanced Alexzo AI model.</p>
                  
                  <div className="bg-gray-800/50 rounded-xl p-3 md:p-4 font-mono text-sm md:text-base border border-gray-700 overflow-x-auto">
                    <span className="text-purple-400 font-bold">POST</span>{" "}
                    <span className="text-white break-all">https://alexzo.vercel.app/api/generate</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-300 text-base md:text-lg">Request Parameters</h5>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <code className="text-green-400 bg-gray-900 px-2 py-1 rounded text-xs md:text-sm font-mono">prompt</code>
                          <Badge variant="outline" className="text-red-300 border-red-300 w-fit">Required</Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Text description of the image to generate</p>
                        <p className="text-gray-500 text-xs">Type: String | Max length: 1000 characters</p>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <code className="text-green-400 bg-gray-900 px-2 py-1 rounded text-xs md:text-sm font-mono">width</code>
                          <Badge variant="outline" className="text-blue-300 border-blue-300 w-fit">Optional</Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Image width in pixels (default: 512)</p>
                        <p className="text-gray-500 text-xs">Type: Integer | Range: 256-1024</p>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <code className="text-green-400 bg-gray-900 px-2 py-1 rounded text-xs md:text-sm font-mono">height</code>
                          <Badge variant="outline" className="text-blue-300 border-blue-300 w-fit">Optional</Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">Image height in pixels (default: 512)</p>
                        <p className="text-gray-500 text-xs">Type: Integer | Range: 256-1024</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-purple-300 text-base md:text-lg">Response Format</h5>
                    <div className="bg-gray-900 rounded-xl p-3 md:p-4 border border-gray-700 overflow-x-auto">
                      <pre className="text-xs md:text-sm text-gray-300 font-mono">
{`{
  "created": 1640995200,
  "model": "alexzo-ai-v1",
  "data": [
    {
      "url": "https://generated-image-url.com/image.png",
      "revised_prompt": "Enhanced version of your prompt"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Code Examples */}
            <TabsContent value="examples" className="space-y-6 md:space-y-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">JavaScript Example (Image Generation)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiExample, 'js-image')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'js-image' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'js-image' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{apiExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">Python Example (Image Generation)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(pythonExample, 'python-image')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'python-image' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'python-image' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{pythonExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">cURL Example (Image Generation)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(curlExample, 'curl-image')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'curl-image' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'curl-image' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{curlExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <div className="my-8 border-t border-dashed border-gray-700"></div>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">JavaScript Example (Search)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(searchApiExample, 'js-search')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'js-search' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'js-search' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{searchApiExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">Python Example (Search)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(searchPythonExample, 'python-search')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'python-search' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'python-search' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{searchPythonExample}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-white text-xl md:text-2xl">cURL Example (Search)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(searchCurlExample, 'curl-search')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white w-full sm:w-auto"
                    >
                      {copiedCode === 'curl-search' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copiedCode === 'curl-search' ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-xl p-4 md:p-6 overflow-x-auto border border-gray-700">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono leading-relaxed">{searchCurlExample}</code>
                    </pre>
                  </div>
                  <div className="mt-4 md:mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <h5 className="font-semibold text-green-300 mb-2">💡 Pro Tip</h5>
                    <p className="text-gray-300 text-sm">
                      For best results, be specific in your prompts. Include details about style, lighting, composition, and any specific elements you want in the image. 
                      Remember - it's completely free to use with our Alexzo AI model!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SDKs */}
            <TabsContent value="sdks" className="space-y-6 md:space-y-8">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl md:text-2xl">Official SDKs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    We're working on official SDKs for popular programming languages. For now, you can use the REST API directly with any HTTP client.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-lg">JavaScript/Node.js</h4>
                      <p className="text-gray-400 text-sm mb-4">Use fetch() or axios for HTTP requests</p>
                      <Badge variant="outline" className="text-green-300 border-green-300">Available</Badge>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-lg">Python</h4>
                      <p className="text-gray-400 text-sm mb-4">Use requests library for HTTP requests</p>
                      <Badge variant="outline" className="text-green-300 border-green-300">Available</Badge>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-lg">PHP</h4>
                      <p className="text-gray-400 text-sm mb-4">Use cURL or Guzzle for HTTP requests</p>
                      <Badge variant="outline" className="text-yellow-300 border-yellow-300">Coming Soon</Badge>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h4 className="font-semibold mb-3 text-purple-300 text-lg">Go</h4>
                      <p className="text-gray-400 text-sm mb-4">Use net/http package for HTTP requests</p>
                      <Badge variant="outline" className="text-yellow-300 border-yellow-300">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Ready to Start Creating?</h3>
              <p className="text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Join thousands of developers and creators using our Alexzo AI API to generate stunning images. 
                Get your API key and start building today - completely free!
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold w-full sm:w-auto" asChild>
                <Link href="/api">
                  Get Started Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
