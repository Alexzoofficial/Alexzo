"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Key, Copy, Trash2, Plus, TrendingUp, Code, Book, Check, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
}

export default function APIPage() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)

  const fetchApiKeys = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch("/api/api-keys", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (response.ok) {
        const keys = await response.json()
        setApiKeys(keys)
      } else {
        toast.error("Failed to load API keys.")
      }
    } catch (error) {
      console.error("Error fetching API keys:", error)
      toast.error("An error occurred while loading your keys.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApiKeys()
  }, [user])

  const createAPIKey = async () => {
    if (!keyName.trim()) {
      toast.error("Please enter a name for your API key")
      return
    }
    if (!user) {
      toast.error("You must be logged in to create an API key.")
      return
    }

    setIsCreating(true)
    try {
      const idToken = await user.getIdToken()
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name: keyName }),
      })

      if (response.ok) {
        const newKey = await response.json()
        setApiKeys([...apiKeys, newKey])
        setKeyName("")
        setShowCreateKey(false)
        toast.success("API key created successfully!")
      } else {
        const { error } = await response.json()
        toast.error(`Failed to create API key: ${error}`)
      }
    } catch (error) {
      console.error("Error creating API key:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsCreating(false)
    }
  }

  const copyAPIKey = (key: string, type: "name" | "key") => {
    navigator.clipboard.writeText(key)
    setCopiedKey(`${type}-${key}`)
    toast.success(`${type === "name" ? "Key name" : "API key"} copied to clipboard!`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const confirmDeleteAPIKey = (id: string) => {
    setDeleteKeyId(id)
  }

  const deleteAPIKey = async () => {
    if (!deleteKeyId || !user) return

    try {
      const idToken = await user.getIdToken()
      const response = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ id: deleteKeyId }),
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== deleteKeyId))
        toast.success("API key deleted successfully!")
      } else {
        const { error } = await response.json()
        toast.error(`Failed to delete API key: ${error}`)
      }
    } catch (error) {
      console.error("Error deleting API key:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setDeleteKeyId(null)
    }
  }

  const codeExample = `// AI Image Generation - Free Use
const response = await fetch('https://alexzo.vercel.app/api/zyfoox', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKeys[0]?.key || "alexzo_your_api_key_here"}',
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

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
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

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 md:p-8 max-w-md w-full">
            <CardContent className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-gray-300 mb-6">Please sign in to access the API section</p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full">
                <Link href="/">Go to Home</Link>
              </Button>
            </CardContent>
          </Card>
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
              API
            </h1>
          </div>
        </div>
        <Badge className="bg-purple-600 text-white px-3 py-1">{user.displayName || user.email}</Badge>
      </header>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg md:text-xl flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span>Total API Keys:</span>
                  <span className="text-white font-semibold">{apiKeys.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Status:</span>
                  <Badge className="bg-green-600 text-white">Free Use</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border-gray-800 mb-6 md:mb-8 h-12">
              <TabsTrigger
                value="keys"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-sm"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger
                value="examples"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-sm"
              >
                Examples
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-sm"
              >
                Docs
              </TabsTrigger>
            </TabsList>

            {/* API Keys Tab */}
            <TabsContent value="keys" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-white">Your API Keys</h2>
                <Button
                  onClick={() => setShowCreateKey(true)}
                  className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Key
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : apiKeys.length === 0 ? (
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                  <CardContent className="p-8 md:p-12 text-center">
                    <Key className="h-12 md:h-16 w-12 md:w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No API Keys</h3>
                    <p className="text-gray-400 mb-6 text-sm md:text-base">
                      Create your first API key to start using our free AI image generation
                    </p>
                    <Button
                      onClick={() => setShowCreateKey(true)}
                      className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                    >
                      Create API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <Card
                      key={key.id}
                      className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="font-semibold text-white text-base md:text-lg">{key.name}</h3>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyAPIKey(key.name, "name")}
                                    className="text-gray-400 hover:text-white p-1 h-auto"
                                    title="Copy key name"
                                  >
                                    {copiedKey === `name-${key.name}` ? (
                                      <Check className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400">
                                Created {new Date(key.created).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyAPIKey(key.key, "key")}
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                              >
                                {copiedKey === `key-${key.key}` ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2 text-green-400" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Key
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDeleteAPIKey(key.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                            <div className="flex items-center justify-between">
                              <code className="text-green-400 text-xs md:text-sm font-mono break-all">{key.key}</code>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Code Examples Tab */}
            <TabsContent value="examples" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg md:text-xl">Zyfoox Basic API Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-auto border border-gray-700 mb-4">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono">{codeExample}</code>
                    </pre>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(codeExample)
                      toast.success("Code copied to clipboard!")
                    }}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg md:text-xl">Search Basic API Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-auto border border-gray-700 mb-4">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono">{`// AI-Powered Search - Free Use
const response = await fetch('https://alexzo.vercel.app/api/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKeys[0]?.key || "alexzo_your_api_key_here"}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What are the latest advancements in AI?'
  })
});

const data = await response.json();
console.log(data); // Search results`}</code>
                    </pre>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(`// AI-Powered Search - Free Use
const response = await fetch('https://alexzo.vercel.app/api/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKeys[0]?.key || "alexzo_your_api_key_here"}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What are the latest advancements in AI?'
  })
});

const data = await response.json();
console.log(data); // Search results`)
                      toast.success("Code copied to clipboard!")
                    }}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
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
                  <CardTitle className="text-white text-lg md:text-xl">API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">
                    Complete documentation for our AI image generation API including authentication, endpoints, and
                    examples.
                  </p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                    <Link href="/docs">
                      <Book className="h-4 w-4 mr-2" />
                      View Full Documentation
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
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
                placeholder="My API Key"
                maxLength={50}
              />
            </div>
            <Button onClick={createAPIKey} disabled={isCreating} className="w-full bg-purple-600 hover:bg-purple-700">
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteKeyId} onOpenChange={() => setDeleteKeyId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Delete API Key
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke
              access for this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteAPIKey} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
