"use client"

import { useState } from "react"
import { Settings, LogOut, Key } from 'lucide-react'
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
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"
import Link from "next/link"

export function UserAvatar() {
  const { user, userAvatar, signOut, updateProfile } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fullName, setFullName] = useState(user?.displayName || "")


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
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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

      {/* Profile Settings Dialog */}
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
            <Button onClick={handleUpdateProfile} className="w-full bg-purple-600 hover:bg-purple-700">
              Update Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}
