"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  User, 
  Key, 
  Settings, 
  Activity, 
  Plus, 
  Copy, 
  Check, 
  Trash2,
  ArrowRight,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, isSupabaseConfigured, updateProfile } = useAuth()
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [fullName, setFullName] = useState("")
  const [updating, setUpdating] = useState(false)
  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "My First API Key",
      key: "ak_live_1234567890abcdef",
      created: "2024-01-15",
      lastUsed: "2 days ago",
      requests: 1247,
      status: "active"
    },
    {
      id: "2", 
      name: "Production Key",
      key: "ak_live_abcdef1234567890",
      created: "2024-01-10",
      lastUsed: "1 hour ago", 
      requests: 5623,
      status: "active"
    }
  ])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && user.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name)
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) return
    
    setUpdating(true)
    try {
      await updateProfile({ full_name: fullName.trim() })
      setShowSettings(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setUpdating(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(`${type}-${text}`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.user_metadata?.full_name || "there"}! 
              </h1>
              <p className="text-gray-300">
                Manage your AI tools and API access from your dashboard
              </p>
            </div>
            <Button
              onClick={() => {
                setFullName(user.user_metadata?.full_name || "")
                setShowSettings(true)
              }}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Profile</CardTitle>
              <User className="h-4 w-4 ml-auto text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{user.user_metadata?.full_name || "User"}</div>
              <p className="text-xs text-gray-400">{user.email}</p>
              <Button
                onClick={() => {
                  setFullName(user.user_metadata?.full_name || "")
                  setShowSettings(true)
                }}
                variant="ghost"
                size="sm"
                className="mt-2 text-purple-400 hover:text-white"
              >
                Edit Profile <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* API Keys Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">API Keys</CardTitle>
              <Key className="h-4 w-4 ml-auto text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{apiKeys.length}</div>
              <p className="text-xs text-gray-400">Active API keys</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 text-purple-400 hover:text-white">
                <Link href="/api">
                  Manage Keys <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Activity</CardTitle>
              <Activity className="h-4 w-4 ml-auto text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6,870</div>
              <p className="text-xs text-gray-400">Total API requests</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 text-purple-400 hover:text-white">
                <Link href="/api">
                  View Analytics <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/api">
                  <Key className="h-4 w-4 mr-2" />
                  Create API Key
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/playground">
                  Generate Image
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Link href="/showcase">
                  Explore Showcase
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent API Keys */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-white">Recent API Keys (Demo)</CardTitle>
            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/api">
                <Plus className="h-4 w-4 mr-2" />
                New Key
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.slice(0, 3).map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{key.name}</h4>
                    <p className="text-sm text-gray-400">
                      Created {new Date(key.created).toLocaleDateString()} • {key.requests} requests
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                      {key.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key.key, "key")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedKey === `key-${key.key}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <Button asChild variant="ghost" className="w-full text-purple-400 hover:text-white">
                <Link href="/api">
                  View All API Keys <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-2"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user.email || ""} disabled className="bg-gray-800 border-gray-700 mt-2 opacity-50" />
            </div>
            <Button 
              onClick={handleUpdateProfile} 
              disabled={updating}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {updating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}