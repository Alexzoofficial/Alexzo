"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Key, Copy, Trash2, Plus, BarChart3, Code, Book, Zap, Activity, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Image from "next/image"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
}

export default function APIDashboard() {
  const { user, loading } = useAuth()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [showTestAPI, setShowTestAPI] = useState(false)
  const [testPrompt, setTestPrompt] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    loadAPIKeys()
  }, [user])

  const loadAPIKeys = () => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.uid}`)
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys))
      }
    }
  }

  const generateAPIKey = () => {
    return `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }

  const createAPIKey = () => {
    if (!keyName.trim()) {
      toast.error("Please enter a name for your API key")
      return
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: keyName,
      key: generateAPIKey(),
      created: new Date().toISOString(),
      lastUsed: "Never",
    }

    const updatedKeys = [...apiKeys, newKey]
    if (user) {
      localStorage.setItem(`api_keys_${user.uid}`, JSON.stringify(updatedKeys))
    }
    setApiKeys(updatedKeys)
    setKeyName("")
    setShowCreateKey(false)
    toast.success("API key created successfully!")
  }

  const copyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("API key copied to clipboard!")
  }

  const deleteAPIKey = (id: string) => {
    const updatedKeys = apiKeys.filter((key) => key.id !== id)
    if (user) {
      localStorage.setItem(`api_keys_${user.uid}`, JSON.stringify(updatedKeys))
    }
    setApiKeys(updatedKeys)
    toast.success("API key deleted successfully!")
  }


  const testAPI = async () => {
    if (!testPrompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    if (apiKeys.length === 0) {
      toast.error("Please create an API key first")
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const apiKey = apiKeys[0].key

      const response = await fetch('/api/proxy/zyfoox/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: testPrompt,
          width: 512,
          height: 512
        })
      })

      const data = await response.json()

      if (response.ok && data.data) {
        setTestResult(data.data[0].url)
        toast.success("Image generated successfully!")
      } else {
        toast.error(data.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Test API error:", error)
      toast.error("Failed to test API")
    } finally {
      setIsTesting(false)
    }
  }

  const codeExample = `// Zyfoox Image Generation
const response = await fetch('/api/proxy/zyfoox/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKeys[0]?.key || 'alexzo_your_api_key_here'}',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-8">
          <CardContent className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">Please sign in to access the API section</p>
            <Button onClick={() => window.location.href = '/'} className="bg-purple-600 hover:bg-purple-700">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
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
      <header className="relative z-50 p-6 flex justify-between items-center border-b border-gray-800/50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => window.close()} className="text-white hover:bg-gray-800">
            <X className="h-5 w-5 mr-2" />
            Close Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-white">Zyfoox API Dashboard</h1>
        </div>
        <Badge className="bg-purple-600 text-white px-3 py-1">
          {user.displayName || user.email}
        </Badge>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total API Keys</p>
                  <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
                </div>
                <Key className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Keys</p>
                  <p className="text-2xl font-bold text-white">{apiKeys.length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Model</p>
                  <p className="text-2xl font-bold text-white">Zyfoox</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border-gray-800 mb-8 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="keys" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">API Keys</TabsTrigger>
            <TabsTrigger value="test" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Test API</TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Code Examples</TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Documentation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">Welcome to Zyfoox API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6 text-lg">
                  Generate stunning images with our advanced AI model. Get started by creating an API key and making your first request.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setShowCreateKey(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800" onClick={() => window.open('/docs', '_blank')}>
                    <Book className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">API Keys</h2>
              <Button onClick={() => setShowCreateKey(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New Key
              </Button>
            </div>

            {apiKeys.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Key className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No API Keys</h3>
                  <p className="text-gray-400 mb-6">Create your first API key to start using Zyfoox</p>
                  <Button onClick={() => setShowCreateKey(true)} className="bg-purple-600 hover:bg-purple-700">
                    Create API Key
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <Card key={key.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-white text-lg">{key.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAPIKey(key.key)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAPIKey(key.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-400">Created {new Date(key.created).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-400">Last used: {key.lastUsed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Test API Tab */}
          <TabsContent value="test" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">Test Your API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Test your API key by generating an image.
                </p>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Please create an API key first to test the API</p>
                    <Button onClick={() => setShowCreateKey(true)} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="testPrompt" className="text-white">Image Prompt</Label>
                      <Input
                        id="testPrompt"
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        placeholder="A beautiful sunset over mountains..."
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        disabled={isTesting}
                      />
                    </div>
                    <Button 
                      onClick={testAPI} 
                      disabled={isTesting || !testPrompt.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isTesting ? "Generating..." : "Test API & Generate Image"}
                    </Button>
                    {testResult && (
                      <div className="mt-4 space-y-2">
                        <p className="text-green-400 font-semibold">✓ Image generated successfully!</p>
                        <Image 
                          src={testResult} 
                          alt="Generated" 
                          width={512}
                          height={512}
                          className="w-full rounded-lg border border-gray-700"
                          unoptimized
                        />
                        <p className="text-sm text-gray-400">
                          Using API Key: {apiKeys[0].name}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">Zyfoox Image Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto border border-gray-700 mb-4">
                  <pre className="text-sm">
                    <code className="text-gray-300 font-mono">{codeExample}</code>
                  </pre>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(codeExample)
                    toast.success("Code copied to clipboard!")
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-xl">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6 text-lg">
                  Complete documentation for the Zyfoox API including authentication, endpoints, and examples.
                </p>
                <Button
                  onClick={() => window.open('/docs', '_blank')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Book className="h-4 w-4 mr-2" />
                  View Full Documentation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="keyName">Enter a display name for the key</Label>
              <Input
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-2"
                placeholder="My Zyfoox API Key"
                maxLength={50}
              />
            </div>
            <Button onClick={createAPIKey} className="w-full bg-purple-600 hover:bg-purple-700">
              Create API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
