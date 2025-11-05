"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Key, Copy, Trash2, Plus, TrendingUp, Code, Book, Check, AlertTriangle } from "lucide-react"
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
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null)

  const loadAPIKeys = useCallback(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.uid}`)
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys))
      }
    }
  }, [user])

  useEffect(() => {
    loadAPIKeys()
  }, [loadAPIKeys])

  const generateUniqueAPIKey = (): string => {
    let newKey = ""
    let isUnique = false

    while (!isUnique) {
      newKey = `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      // Check if key already exists for this user or any other user
      isUnique = !apiKeys.some((key) => key.key === newKey)

      // Also check localStorage for all users (basic uniqueness check)
      const allKeys = Object.keys(localStorage)
        .filter((key) => key.startsWith("api_keys_"))
        .flatMap((key) => {
          try {
            return JSON.parse(localStorage.getItem(key) || "[]") as APIKey[]
          } catch {
            return [] as APIKey[]
          }
        })

      isUnique = isUnique && !allKeys.some((key: APIKey) => key.key === newKey)
    }

    return newKey
  }

  const createAPIKey = () => {
    if (!keyName.trim()) {
      toast.error("Please enter a name for your API key")
      return
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: keyName,
      key: generateUniqueAPIKey(),
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

  const copyAPIKey = (key: string, type: "name" | "key") => {
    navigator.clipboard.writeText(key)
    setCopiedKey(`${type}-${key}`)
    toast.success(`${type === "name" ? "Key name" : "API key"} copied to clipboard!`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const confirmDeleteAPIKey = (id: string) => {
    setDeleteKeyId(id)
  }

  const deleteAPIKey = () => {
    if (!deleteKeyId) return

    const updatedKeys = apiKeys.filter((key) => key.id !== deleteKeyId)
    if (user) {
      localStorage.setItem(`api_keys_${user.uid}`, JSON.stringify(updatedKeys))
    }
    setApiKeys(updatedKeys)
    setDeleteKeyId(null)
    toast.success("API key deleted successfully!")
  }


  const codeExample = `// Model: AI Image Generation
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

  const webSearchExample = `// Model: Real-Time Web Search
const response = await fetch('https://alexzo.vercel.app/api/search?q=latest+ai+news', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKeys[0]?.key || "alexzo_your_api_key_here"}',
  }
});

const data = await response.json();
console.log(data.results);`

  const fullExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexzo AI Image Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #ffffff;
            min-height: 100vh;
            padding: 20px;
        }
        
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            margin-bottom: 20px;
        }
        
        .back-btn:hover {
            background: rgba(99, 102, 241, 0.4);
            color: white;
        }
        
        .main-container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(42, 42, 62, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(99, 102, 241, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.95;
        }
        
        .content {
            padding: 40px;
        }
        
        .input-group {
            margin-bottom: 25px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #a5b4fc;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .input-group input,
        .input-group textarea {
            width: 100%;
            padding: 15px;
            background: rgba(30, 30, 50, 0.8);
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 10px;
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        .input-group input:focus,
        .input-group textarea:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .input-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .size-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .generate-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        
        .generate-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        }
        
        .generate-btn:active:not(:disabled) {
            transform: translateY(0);
        }
        
        .generate-btn:disabled {
            background: #555;
            cursor: not-allowed;
            box-shadow: none;
        }
        
        #result {
            margin-top: 30px;
        }
        
        .result-card {
            background: rgba(30, 30, 50, 0.6);
            border-radius: 15px;
            padding: 25px;
            border: 2px solid rgba(99, 102, 241, 0.3);
        }
        
        .result-card h3 {
            margin-bottom: 20px;
            color: #a5b4fc;
            font-size: 1.3em;
        }
        
        #generatedImage {
            width: 100%;
            border-radius: 12px;
            margin: 15px 0;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        }
        
        #generatedImage:hover {
            transform: scale(1.02);
        }
        
        .image-info {
            margin-top: 15px;
            padding: 15px;
            background: rgba(99, 102, 241, 0.1);
            border-radius: 8px;
            border-left: 4px solid #6366f1;
        }
        
        .image-info p {
            margin: 8px 0;
            line-height: 1.6;
        }
        
        .image-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .action-btn {
            padding: 10px 20px;
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            border: 1px solid #6366f1;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .action-btn:hover {
            background: rgba(99, 102, 241, 0.4);
            color: white;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(99, 102, 241, 0.3);
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #ef4444;
        }
        
        .success {
            color: #6ee7b7;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #a5b4fc;
            font-size: 0.9em;
            border-top: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        @media (max-width: 768px) {
            .size-inputs {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .content {
                padding: 25px;
            }
        }
    </style>
</head>
<body>
    <button class="back-btn" onclick="window.history.back()">
        ← Back
    </button>
    
    <div class="main-container">
        <div class="header">
            <h1>🎨 AI Image Generator</h1>
            <p>Transform your ideas into stunning visuals with Alexzo AI</p>
        </div>
        
        <div class="content">
            <div class="input-group">
                <label for="prompt">✨ Image Description</label>
                <textarea 
                    id="prompt" 
                    placeholder="Describe the image you want to create... Be creative and detailed!"
                    rows="4"
                ></textarea>
            </div>
            
            <div class="size-inputs">
                <div class="input-group">
                    <label for="width">📐 Width (px)</label>
                    <input 
                        type="number" 
                        id="width" 
                        value="512" 
                        min="256" 
                        max="1024"
                        step="64"
                    />
                </div>
                <div class="input-group">
                    <label for="height">📏 Height (px)</label>
                    <input 
                        type="number" 
                        id="height" 
                        value="512" 
                        min="256" 
                        max="1024"
                        step="64"
                    />
                </div>
            </div>
            
            <button class="generate-btn" onclick="generateImage()">
                🚀 Generate Image
            </button>
            
            <div id="result"></div>
        </div>
        
        <div class="footer">
            Powered by <strong>Alexzo AI</strong> • Free AI Image Generation
        </div>
    </div>

    <script>
        // ⚠️ REPLACE WITH YOUR API KEY
        const API_KEY = 'alexzo_your_api_key_here';

        // Back button is always visible

        async function generateImage() {
            const promptInput = document.getElementById('prompt');
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');
            const resultDiv = document.getElementById('result');
            const button = document.querySelector('.generate-btn');
            
            const prompt = promptInput.value.trim();
            const width = parseInt(widthInput.value) || 512;
            const height = parseInt(heightInput.value) || 512;
            
            if (!prompt) {
                resultDiv.innerHTML = \`
                    <div class="error">
                        <strong>❌ Error:</strong> Please describe the image you want to generate
                    </div>
                \`;
                promptInput.focus();
                return;
            }
            
            button.disabled = true;
            button.textContent = '⏳ Generating...';
            resultDiv.innerHTML = \`
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p style="color: #a5b4fc; font-size: 1.1em;">Creating your masterpiece...</p>
                    <p style="color: #6b7280; font-size: 0.9em; margin-top: 10px;">This may take a few seconds</p>
                </div>
            \`;
            
            try {
                const response = await fetch('https://alexzo.vercel.app/api/generate', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`Bearer \${API_KEY}\`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        width: width,
                        height: height
                    })
                });
                
                const data = await response.json();
                
                if (response.ok && data.data && data.data[0]) {
                    const imageUrl = data.data[0].url;
                    const revisedPrompt = data.data[0].revised_prompt || prompt;
                    
                    resultDiv.innerHTML = \`
                        <div class="result-card">
                            <h3 class="success">✅ Image Generated Successfully!</h3>
                            <img id="generatedImage" src="\${imageUrl}" alt="AI Generated: \${prompt}" />
                            <div class="image-info">
                                <p><strong>📝 Original Prompt:</strong> \${prompt}</p>
                                <p><strong>🎯 AI Enhanced Prompt:</strong> \${revisedPrompt}</p>
                                <p><strong>📐 Dimensions:</strong> \${width} × \${height}px</p>
                            </div>
                            <div class="image-actions">
                                <a href="\${imageUrl}" download="alexzo-ai-generated.png" class="action-btn">
                                    ⬇️ Download
                                </a>
                                <a href="\${imageUrl}" target="_blank" class="action-btn">
                                    🔗 Open in New Tab
                                </a>
                            </div>
                        </div>
                    \`;
                } else {
                    const errorMessage = data.error || data.message || 'Failed to generate image';
                    resultDiv.innerHTML = \`
                        <div class="error">
                            <strong>❌ Generation Failed</strong>
                            <p style="margin-top: 10px;">\${errorMessage}</p>
                            <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                                Please check your API key in the code and try again
                            </p>
                        </div>
                    \`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`
                    <div class="error">
                        <strong>❌ Connection Error</strong>
                        <p style="margin-top: 10px;">\${error.message}</p>
                        <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                            Please check your internet connection and try again
                        </p>
                    </div>
                \`;
            } finally {
                button.disabled = false;
                button.textContent = '🚀 Generate Image';
            }
        }
        
        document.getElementById('prompt').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateImage();
            }
        });
        
        ['width', 'height'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    generateImage();
                }
            });
        });
    </script>
</body>
</html>`

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
                value="models"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 text-sm"
              >
                Models
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

              {apiKeys.length === 0 ? (
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

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg md:text-xl">Image Generation Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    Generate high-quality images from text prompts.
                  </p>
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

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg md:text-xl">Web Search Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    Get real-time web search results.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-auto border border-gray-700 mb-4">
                    <pre className="text-xs md:text-sm">
                      <code className="text-gray-300 font-mono">{webSearchExample}</code>
                    </pre>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(webSearchExample)
                      toast.success("Code copied to clipboard!")
                    }}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg md:text-xl">Complete HTML Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 text-sm md:text-base">
                    Replace <code className="text-purple-400 bg-gray-800 px-2 py-1 rounded">alexzo_your_api_key_here</code> with your actual API key in the code below:
                  </p>
                  <div className="relative">
                    <Button
                      onClick={() => {
                        const blob = new Blob([fullExample], { type: "text/html" })
                        const url = URL.createObjectURL(blob)
                        window.open(url, "_blank")
                        toast.success("Preview opened in new tab!")
                        setTimeout(() => URL.revokeObjectURL(url), 1000)
                      }}
                      size="sm"
                      className="absolute top-2 right-2 z-10 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 text-gray-300 backdrop-blur-sm"
                    >
                      <Code className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <div className="bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-auto border border-gray-700 mb-4 max-h-96">
                      <pre className="text-xs">
                        <code className="text-gray-300 font-mono">{fullExample}</code>
                      </pre>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(fullExample)
                        toast.success("Full HTML code copied to clipboard!")
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Full Code
                    </Button>
                    <Button
                      onClick={() => {
                        const blob = new Blob([fullExample], { type: "text/html" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "ai-image-generator.html"
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success("HTML file downloaded!")
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Download HTML
                    </Button>
                  </div>
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
        <DialogContent className="bg-gray-900 border-gray-800 text-white mx-4 max-w-md">
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
            <Button onClick={createAPIKey} className="w-full bg-purple-600 hover:bg-purple-700">
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
