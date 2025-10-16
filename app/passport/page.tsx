"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Zap,
  Key,
  Users,
  Settings,
  ArrowUpRight,
  Copy,
  Plus,
  Brain,
  MessageSquare,
  Globe,
  Shield,
  Eye,
  Mic,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"
import Link from "next/link"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  requests: number
}

interface ModelCategory {
  title: string
  icon: any
  models: Array<{
    name: string
    provider: string
    description: string
    status: "live" | "beta" | "coming-soon"
  }>
}

export default function PassportPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [todayRequests] = useState(1247)
  const [monthlyRequests] = useState(45892)
  const [tokensUsed] = useState(892456)

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      loadAPIKeys()
    }
    
    if (!user) return

    const handleAPIKeyUpdate = () => {
      loadAPIKeys()
    }

    window.addEventListener('api-key-updated', handleAPIKeyUpdate)
    return () => window.removeEventListener('api-key-updated', handleAPIKeyUpdate)
  }, [user])

  const loadAPIKeys = () => {
    const savedKeys = localStorage.getItem(`passport_keys_${user?.uid}`)
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }
  }

  const generateAPIKey = () => {
    return `alexzo-xyz_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
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
      requests: 0,
    }

    const updatedKeys = [...apiKeys, newKey]
    localStorage.setItem(`passport_keys_${user?.uid}`, JSON.stringify(updatedKeys))
    setApiKeys(updatedKeys)
    setKeyName("")
    setShowCreateKey(false)
    toast.success("API key created successfully!")
  }

  const copyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("API key copied to clipboard!")
  }

  const modelCategories: ModelCategory[] = [
    {
      title: "Reasoning",
      icon: Brain,
      models: [
        {
          name: "DeepSeek R1 Distill Llama",
          provider: "DeepSeek",
          description: "Advanced reasoning model",
          status: "live",
        },
        { name: "Qwen 3 32B", provider: "Alibaba", description: "Large language model", status: "live" },
        { name: "Kimi K2", provider: "Moonshot", description: "Conversational AI", status: "beta" },
      ],
    },
    {
      title: "Speech to Text",
      icon: Mic,
      models: [
        { name: "Whisper Large v3", provider: "OpenAI", description: "Speech recognition", status: "live" },
        { name: "Whisper Large v3 Turbo", provider: "OpenAI", description: "Fast speech recognition", status: "live" },
      ],
    },
    {
      title: "Multilingual",
      icon: Globe,
      models: [
        { name: "Kimi K2", provider: "Moonshot", description: "Multilingual support", status: "live" },
        { name: "Llama 4 Scout", provider: "Meta", description: "Multilingual reasoning", status: "beta" },
        { name: "Llama 3.3 70B", provider: "Meta", description: "Large multilingual model", status: "live" },
        { name: "Mistral Saba", provider: "Mistral", description: "European multilingual", status: "live" },
        { name: "Gemma 2", provider: "Google", description: "Lightweight multilingual", status: "live" },
        { name: "Whisper Large v3", provider: "OpenAI", description: "Speech multilingual", status: "live" },
      ],
    },
    {
      title: "Function Calling / Tool Use",
      icon: Settings,
      models: [
        { name: "Llama 4 Scout", provider: "Meta", description: "Function calling", status: "beta" },
        { name: "Qwen 3 32B", provider: "Alibaba", description: "Tool integration", status: "live" },
        { name: "Kimi K2", provider: "Moonshot", description: "API integration", status: "live" },
      ],
    },
    {
      title: "Text to Text",
      icon: MessageSquare,
      models: [
        { name: "Kimi K2", provider: "Moonshot", description: "Text generation", status: "live" },
        { name: "Llama 4 Scout", provider: "Meta", description: "Text processing", status: "beta" },
        { name: "Llama 3.3 70B", provider: "Meta", description: "Large text model", status: "live" },
        { name: "Gemma 2", provider: "Google", description: "Efficient text model", status: "live" },
      ],
    },
    {
      title: "Text to Speech",
      icon: Mic,
      models: [{ name: "PlayAI TTS", provider: "PlayAI", description: "Natural voice synthesis", status: "live" }],
    },
    {
      title: "Vision",
      icon: Eye,
      models: [{ name: "Llama 4 Scout", provider: "Meta", description: "Vision understanding", status: "beta" }],
    },
    {
      title: "Safety / Content Moderation",
      icon: Shield,
      models: [{ name: "Llama Guard 4", provider: "Meta", description: "Content safety", status: "live" }],
    },
  ]

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Authentication Required</CardTitle>
              <p className="text-gray-400">Please sign in to access your Passport dashboard</p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAuthModal(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
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

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              You're Cooking
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Your AI development passport - track usage, manage keys, and access powerful models
            </p>
          </motion.div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-gray-400 text-sm mb-2">Today</h3>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-xs">Today</span>
                </div>
                <p className="text-3xl font-bold text-white">${(todayRequests * 0.001).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-gray-400 text-sm mb-2">Last 30 Days</h3>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-xs">Current</span>
                </div>
                <p className="text-3xl font-bold text-white">${(monthlyRequests * 0.001).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-gray-400 text-sm mb-2">Token Usage</h3>
                <div className="h-16 flex items-end justify-center space-x-1 mb-2">
                  {[40, 60, 30, 80, 50, 70, 90].map((height, i) => (
                    <div key={i} className="w-2 bg-orange-500 rounded-t" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <p className="text-lg font-semibold text-white">{tokensUsed.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button className="bg-red-600 hover:bg-red-700">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
          <Link href="/docs">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white bg-transparent">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white bg-transparent"
            onClick={() => setShowCreateKey(true)}
          >
            <Key className="h-4 w-4 mr-2" />
            Manage API Keys
          </Button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Playground</h3>
                  <p className="text-gray-400 text-sm">Chat & play around with models</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
            </CardContent>
          </Card>

          <Link href="/docs">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Docs</h3>
                    <p className="text-gray-400 text-sm">Guides & how-to's</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Manage Team</h3>
                  <p className="text-gray-400 text-sm">Add users, manage permissions</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
            </CardContent>
          </Card>
        </div>

        {/* The Models Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">The Models</h2>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-blue-300 text-sm">
                <strong>What's New:</strong> Moonshot AI's latest Kimi K2 Instruct model is live on Alexzo!
                <Link href="/docs" className="underline ml-1">
                  Try it now
                </Link>{" "}
                and learn more on how to build fast with it
                <Link href="/docs" className="underline ml-1">
                  here
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modelCategories.map((category, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 text-purple-400 mr-2" />
                    <CardTitle className="text-white text-sm font-medium">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {category.models.map((model, modelIndex) => (
                      <div key={modelIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-300">{model.provider.charAt(0)}</span>
                          </div>
                          <span className="text-gray-300 text-sm">{model.name}</span>
                        </div>
                        <Badge
                          variant={
                            model.status === "live" ? "default" : model.status === "beta" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {model.status === "live" ? "●" : model.status === "beta" ? "β" : "○"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              We're adding new models all the time and will let you know when a new one comes online.
              <br />
              See full details on our{" "}
              <Link href="/docs" className="text-purple-400 hover:text-purple-300 underline">
                Models page
              </Link>
              .
            </p>
          </div>
        </div>

        {/* API Keys Management Modal */}
        <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>API Keys</DialogTitle>
              <p className="text-gray-400">
                Manage your API keys. Remember to keep your API keys safe to prevent unauthorized access.
              </p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your API Keys</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Create API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="keyName">Enter a display name for the key (max 50 characters)</Label>
                        <Input
                          id="keyName"
                          value={keyName}
                          onChange={(e) => setKeyName(e.target.value)}
                          className="bg-gray-800 border-gray-700 mt-2"
                          placeholder="My API Key"
                          maxLength={50}
                        />
                      </div>
                      <Button onClick={createAPIKey} className="w-full bg-purple-600 hover:bg-purple-700">
                        Submit
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">(No keys)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <Card key={key.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{key.name}</h4>
                            <p className="text-gray-400 text-sm">
                              Created {new Date(key.created).toLocaleDateString()}
                            </p>
                            <p className="text-gray-400 text-sm">Last used: {key.lastUsed}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-900 px-3 py-1 rounded text-sm text-gray-300">
                              {key.key.substring(0, 20)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyAPIKey(key.key)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
