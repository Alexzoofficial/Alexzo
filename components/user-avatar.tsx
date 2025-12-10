"use client"

import { useState, useEffect } from "react"
import { Settings, LogOut, Key, Copy, Trash2, Plus, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"
import Link from "next/link"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
  requests: number
}

export function UserAvatar() {
  const { user, userAvatar, signOut, updateProfile } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [fullName, setFullName] = useState(user?.displayName || "")

  const getAuthHeader = async () => {
    if (!user) return null
    const idToken = await user.getIdToken()
    return { 'Authorization': `Bearer ${idToken}` }
  }

  const loadAPIKeys = async () => {
    if (!user) return
    const headers = await getAuthHeader()
    if (!headers) return

    try {
      const response = await fetch('/api/keys', { headers })
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.keys)
      } else {
        toast.error("Failed to load API keys.")
      }
    } catch (error) {
      toast.error("An error occurred while fetching API keys.")
    }
  }

  const createAPIKey = async () => {
    if (!keyName.trim()) {
      toast.error("Please enter a name for your API key")
      return
    }
    const headers = await getAuthHeader()
    if (!headers) return

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys([data.key, ...apiKeys])
        setKeyName("")
        setShowCreateKey(false)
        toast.success("API key created successfully!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to create API key.")
      }
    } catch (error) {
      toast.error("An error occurred while creating the API key.")
    }
  }

  const copyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success("API key copied to clipboard!")
  }

  const deleteAPIKey = async (id: string) => {
    const headers = await getAuthHeader()
    if (!headers) return

    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id))
        toast.success("API key deleted successfully!")
      } else {
        toast.error("Failed to delete API key.")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the API key.")
    }
  }

  useEffect(() => {
    if (user && showSettings) {
      loadAPIKeys()
    }
  }, [user, showSettings])


  const handleUpdateProfile = async () => {
    const result = await updateProfile({ full_name: fullName })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Profile updated successfully!")
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowSettings(false)
  }

  if (!user) {
    return (
      <>
        <Button onClick={() => setShowAuthModal(true)} className="bg-purple-600 hover:bg-purple-700">
          Sign In
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-avatar-button">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || userAvatar || ""} alt={user.displayName || user.email || ""} />
              <AvatarFallback>
                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">{user.displayName || "User"}</p>
              <p className="text-xs leading-none text-gray-400">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem
            onClick={() => {
              setShowSettings(true)
              setFullName(user.displayName || "")
            }}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
            <Link href="/api">
              <Key className="mr-2 h-4 w-4" />
              <span>API</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem onClick={handleSignOut} className="text-gray-300 hover:text-white hover:bg-gray-800">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Settings and API Keys Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile</h3>
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
              <Button onClick={handleUpdateProfile} className="w-full bg-purple-600 hover:bg-purple-700">
                Update Profile
              </Button>
            </div>

            {/* API Key Management */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">API Keys</h3>
                <Button onClick={() => setShowCreateKey(true)} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Key
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {apiKeys.length === 0 ? (
                  <p className="text-gray-400 text-sm">No API keys found.</p>
                ) : (
                  apiKeys.map(apiKey => (
                    <Card key={apiKey.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{apiKey.name}</p>
                          <p className="text-xs text-gray-400 font-mono truncate">{apiKey.key}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyAPIKey(apiKey.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteAPIKey(apiKey.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-2"
                placeholder="e.g., My App"
              />
            </div>
            <Button onClick={createAPIKey} className="w-full bg-purple-600 hover:bg-purple-700">
              Create Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
