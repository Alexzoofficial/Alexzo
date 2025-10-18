"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Code, BarChart3, Settings, Trash2, Eye, MoreVertical, Copy, Globe, Zap, Dog, ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"
import Image from "next/image"

interface API {
  id: string
  name: string
  description: string
  endpoint: string
  method: string
  status: "active" | "inactive"
  successRate: number
  createdAt: string
  apiKey: string
}

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  createdAt: string
}

export default function APICreatePage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [apis, setApis] = useState<API[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedAPI, setSelectedAPI] = useState<API | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // Dogs section state
  const [dogPrompt, setDogPrompt] = useState("")
  const [isGeneratingDog, setIsGeneratingDog] = useState(false)
  const [generatedDogImages, setGeneratedDogImages] = useState<GeneratedImage[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
  })

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      loadUserAPIs()
      loadGeneratedImages()
    }
  }, [user])

  const loadUserAPIs = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/custom-apis', {
        method: 'GET',
        headers: {
          'x-user-id': user.uid
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setApis(data.apis || [])
      }
    } catch (error) {
      console.error('Error loading APIs:', error)
      toast.error('Failed to load APIs')
    }
  }

  const loadGeneratedImages = () => {
    // Images are not saved - this function is now a no-op
    // User requested: images should NOT be saved
  }

  const saveAPIs = (newAPIs: API[]) => {
    // APIs are now saved to Firebase via API endpoints, not localStorage
    setApis(newAPIs)
  }

  const saveGeneratedImages = (images: GeneratedImage[]) => {
    // Images are NOT saved per user request
    // Just update state for current session only
    setGeneratedDogImages(images)
  }

  const generateAPIKey = () => {
    return `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  }

  const createAPI = async () => {
    if (!formData.name || !formData.description || !formData.endpoint) {
      toast.error("Please fill in all fields")
      return
    }

    if (!user) return

    try {
      const response = await fetch('/api/custom-apis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          name: formData.name,
          description: formData.description,
          endpoint: formData.endpoint,
          method: formData.method
        })
      })

      if (response.ok) {
        const data = await response.json()
        setApis([...apis, data.api])
        setFormData({ name: "", description: "", endpoint: "", method: "GET" })
        setShowCreateDialog(false)
        toast.success("API created successfully!")
      } else {
        toast.error("Failed to create API")
      }
    } catch (error) {
      console.error('Error creating API:', error)
      toast.error("Failed to create API")
    }
  }

  const generateDogImage = async () => {
    if (!dogPrompt.trim()) {
      toast.error("Please enter a description for your dog image")
      return
    }

    setIsGeneratingDog(true)
    try {
      // Use our proxy endpoint for image generation
      const response = await fetch('/api/proxy/zyfoox/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${generateAPIKey()}`
        },
        body: JSON.stringify({
          prompt: `${dogPrompt}, cute dog, high quality, detailed, professional photography`,
          width: 512,
          height: 512
        })
      })

      if (response.ok) {
        const data = await response.json()
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          prompt: dogPrompt,
          imageUrl: data.data[0].url,
          createdAt: new Date().toISOString()
        }

        const updatedImages = [newImage, ...generatedDogImages]
        saveGeneratedImages(updatedImages)
        setDogPrompt("")
        toast.success("Dog image generated successfully!")
      } else {
        throw new Error('Failed to generate image')
      }
    } catch (error) {
      console.error("Error generating dog image:", error)
      toast.error("Failed to generate image. Please try again.")
    } finally {
      setIsGeneratingDog(false)
    }
  }

  const deleteAPI = async (id: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/custom-apis?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.uid
        }
      })

      if (response.ok) {
        setApis(apis.filter((api) => api.id !== id))
        toast.success("API deleted successfully!")
      } else {
        toast.error("Failed to delete API")
      }
    } catch (error) {
      console.error('Error deleting API:', error)
      toast.error("Failed to delete API")
    }
  }

  const copyAPIKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    toast.success("API key copied to clipboard!")
  }

  const toggleAPIStatus = async (id: string) => {
    if (!user) return

    const api = apis.find(a => a.id === id)
    if (!api) return

    const newStatus = api.status === "active" ? "inactive" : "active"

    try {
      const response = await fetch('/api/custom-apis', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiId: id,
          userId: user.uid,
          status: newStatus
        })
      })

      if (response.ok) {
        setApis(apis.map((api) =>
          api.id === id ? { ...api, status: newStatus as "active" | "inactive" } : api
        ))
        toast.success("API status updated!")
      } else {
        toast.error("Failed to update API status")
      }
    } catch (error) {
      console.error('Error updating API status:', error)
      toast.error("Failed to update API status")
    }
  }

  const deleteGeneratedImage = (id: string) => {
    const updatedImages = generatedDogImages.filter(img => img.id !== id)
    saveGeneratedImages(updatedImages)
    toast.success("Image deleted successfully!")
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Authentication Required</CardTitle>
              <p className="text-gray-400">Please sign in to create and manage APIs</p>
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

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              API Creator
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Create, manage, and monitor your custom APIs with advanced analytics and AI-powered image generation
            </p>
          </motion.div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="apis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border-gray-800">
            <TabsTrigger value="apis" className="data-[state=active]:bg-purple-600">
              <Code className="h-4 w-4 mr-2" />
              API Management
            </TabsTrigger>
            <TabsTrigger value="dogs" className="data-[state=active]:bg-purple-600">
              <Dog className="h-4 w-4 mr-2" />
              Dog Image Generator
            </TabsTrigger>
          </TabsList>

          {/* API Management Tab */}
          <TabsContent value="apis" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total APIs</p>
                      <p className="text-2xl font-bold text-white">{apis.length}</p>
                    </div>
                    <Code className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active APIs</p>
                      <p className="text-2xl font-bold text-white">
                        {apis.filter((api) => api.status === "active").length}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Success Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {apis.length > 0
                          ? Math.round(apis.reduce((sum, api) => sum + api.successRate, 0) / apis.length)
                          : 0}
                        %
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create API Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your APIs</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900/95 border-gray-800 text-white backdrop-blur-sm">
                  <DialogHeader>
                    <DialogTitle>Create New API</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">API Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        placeholder="My Awesome API"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        placeholder="Describe what your API does..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="endpoint">Endpoint Path</Label>
                      <Input
                        id="endpoint"
                        value={formData.endpoint}
                        onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                        placeholder="/api/v1/my-endpoint"
                      />
                    </div>
                    <div>
                      <Label htmlFor="method">HTTP Method</Label>
                      <Select
                        value={formData.method}
                        onValueChange={(value) => setFormData({ ...formData, method: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={createAPI} className="w-full bg-purple-600 hover:bg-purple-700">
                      Create API
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* APIs Grid */}
            {apis.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No APIs Created Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first API to get started with custom endpoints</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First API
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apis.map((api) => (
                  <Card key={api.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-1">{api.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{api.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAPI(api)
                                setShowAnalytics(true)
                              }}
                              className="text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleAPIStatus(api.id)}
                              className="text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              {api.status === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteAPI(api.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete API
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={api.method === "GET" ? "default" : "secondary"} className="text-xs">
                            {api.method}
                          </Badge>
                          <Badge variant={api.status === "active" ? "default" : "secondary"} className="text-xs">
                            {api.status}
                          </Badge>
                        </div>

                        <div className="bg-gray-800 rounded p-2 text-xs font-mono text-gray-300">{api.endpoint}</div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">API Key:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAPIKey(api.apiKey)}
                            className="text-gray-300 hover:text-white p-1 h-auto"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>

                        <div className="text-sm">
                          <p className="text-gray-400">Success Rate</p>
                          <p className="text-white font-semibold">{api.successRate}%</p>
                        </div>

                        <div className="text-xs text-gray-500">Created {new Date(api.createdAt).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Dogs Image Generator Tab */}
          <TabsContent value="dogs" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Generator Section */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Dog className="h-6 w-6 text-purple-400" />
                    <span>Generate Dog Images</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dogPrompt">Describe your perfect dog image</Label>
                    <Textarea
                      id="dogPrompt"
                      placeholder="A golden retriever playing in a sunny park, professional photography, high quality..."
                      value={dogPrompt}
                      onChange={(e) => setDogPrompt(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    onClick={generateDogImage}
                    disabled={isGeneratingDog || !dogPrompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {isGeneratingDog ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Dog className="mr-2 h-4 w-4" />
                        Generate Dog Image
                      </>
                    )}
                  </Button>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-purple-300">Tips for better dog images:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Specify the dog breed (e.g., "golden retriever", "husky")</li>
                      <li>• Describe the setting (park, beach, home, studio)</li>
                      <li>• Mention the mood (playful, calm, energetic)</li>
                      <li>• Include lighting details (sunny, golden hour, studio lighting)</li>
                      <li>• Add quality terms (professional photography, high resolution)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Images Gallery */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Generated Images</span>
                    <Badge variant="outline" className="text-purple-300 border-purple-300">
                      {generatedDogImages.length} images
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedDogImages.length === 0 ? (
                    <div className="text-center py-12">
                      <Dog className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No images generated yet</p>
                      <p className="text-sm text-gray-500 mt-2">Create your first dog image to get started!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {generatedDogImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={image.imageUrl || "/placeholder.svg"}
                              alt={image.prompt}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteGeneratedImage(image.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 truncate">{image.prompt}</p>
                            <p className="text-xs text-gray-500">{new Date(image.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Analytics Modal */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="bg-gray-900/95 border-gray-800 text-white max-w-4xl backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>API Analytics - {selectedAPI?.name}</DialogTitle>
            </DialogHeader>
            {selectedAPI && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Success Rate</p>
                        <p className="text-2xl font-bold text-green-400">{selectedAPI.successRate}%</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Status</p>
                        <Badge variant={selectedAPI.status === "active" ? "default" : "secondary"}>
                          {selectedAPI.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4">API Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Endpoint:</span>
                      <span className="font-mono text-sm">{selectedAPI.endpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Method:</span>
                      <Badge variant="outline">{selectedAPI.method}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">API Key:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAPIKey(selectedAPI.apiKey)}
                        className="text-gray-300 hover:text-white"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Key
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created:</span>
                      <span>{new Date(selectedAPI.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
                  <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                    <div className="text-gray-400 mb-2">// Example API call</div>
                    <div className="text-green-400">
                      curl -X {selectedAPI.method} \<br />
                      &nbsp;&nbsp;"https://api.alexzo.com{selectedAPI.endpoint}" \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer {selectedAPI.apiKey}" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json"
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
