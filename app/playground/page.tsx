"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Copy, Download, Settings, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"

export default function PlaygroundPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("kimi-k2")
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([1000])

  const models = [
    { id: "kimi-k2", name: "Kimi K2", provider: "Moonshot", status: "live" },
    { id: "llama-4-scout", name: "Llama 4 Scout", provider: "Meta", status: "beta" },
    { id: "deepseek-r1-distill", name: "DeepSeek R1 Distill", provider: "DeepSeek", status: "live" },
    { id: "qwen-3-32b", name: "Qwen 3 32B", provider: "Alibaba", status: "live" },
    { id: "gemma-2", name: "Gemma 2", provider: "Google", status: "live" },
  ]

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    setResponse("")

    try {
      // Get API key from localStorage
      const apiKeys = JSON.parse(localStorage.getItem(`passport_keys_${user.uid}`) || "[]")
      if (apiKeys.length === 0) {
        toast.error("Please create an API key in your Passport dashboard first")
        setLoading(false)
        return
      }

      const apiKey = apiKeys[0].key

      const res = await fetch("/api/proxy/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: prompt }],
          temperature: temperature[0],
          max_tokens: maxTokens[0],
        }),
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setResponse(data.choices[0].message.content)
        toast.success("Response generated successfully!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to generate response")
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    toast.success("Response copied to clipboard!")
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Authentication Required</CardTitle>
              <p className="text-gray-400">Please sign in to access the playground</p>
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
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              AI Playground
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Chat and experiment with our powerful AI models using the Alexzo-xyz API
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Model Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300 mb-2 block">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{model.name}</span>
                          <Badge variant={model.status === "live" ? "default" : "secondary"} className="ml-2">
                            {model.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Temperature: {temperature[0]}</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Controls randomness in responses</p>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block">Max Tokens: {maxTokens[0]}</Label>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  max={4000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Maximum response length</p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">API Endpoint:</span>
                  <code className="text-purple-400 text-xs">/api/proxy/chat/completions</code>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Rate Limit:</span>
                  <span className="text-green-400 text-xs">Unlimited (Free Tier)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Your Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here... Try asking about AI, coding, or anything else!"
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px] resize-none"
                  disabled={loading}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-400">{prompt.length} characters</div>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    AI Response
                  </CardTitle>
                  {response && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyResponse}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Generating response...</p>
                    </div>
                  </div>
                ) : response ? (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans">{response}</pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Your AI response will appear here</p>
                    <p className="text-gray-500 text-sm mt-2">Enter a prompt and click Send to get started</p>
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
