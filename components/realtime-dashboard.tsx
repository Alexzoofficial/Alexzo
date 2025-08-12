"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

interface AnalyticsData {
  [key: string]: {
    event: string
    userId?: string
    timestamp: string
    [key: string]: any
  }
}

interface ContactData {
  [key: string]: {
    name: string
    email: string
    message: string
    timestamp: string
  }
}

export function RealtimeDashboard() {
  const { user, isFirebaseConfigured } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({})
  const [contacts, setContacts] = useState<ContactData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setLoading(false)
      return
    }

    const setupRealtimeListeners = async () => {
      try {
        const { firebaseHelpers } = await import("@/lib/firebase-helpers")

        // Subscribe to analytics (admin only)
        const unsubscribeAnalytics = firebaseHelpers.subscribeToAnalytics((data) => {
          setAnalytics(data || {})
        })

        // Subscribe to user's contacts
        const unsubscribeContacts = firebaseHelpers.subscribeToContacts(user.uid, (data) => {
          setContacts(data || {})
        })

        setLoading(false)

        return () => {
          unsubscribeAnalytics()
          unsubscribeContacts()
        }
      } catch (error) {
        console.error("Error setting up realtime listeners:", error)
        setLoading(false)
      }
    }

    setupRealtimeListeners()
  }, [user, isFirebaseConfigured])

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view the dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Dashboard...</CardTitle>
            <CardDescription>Setting up real-time connections...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const analyticsArray = Object.entries(analytics).map(([key, value]) => ({ id: key, ...value }))
  const contactsArray = Object.entries(contacts).map(([key, value]) => ({ id: key, ...value }))

  const recentAnalytics = analyticsArray
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const recentContacts = contactsArray
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsArray.length}</div>
            <p className="text-xs text-muted-foreground">Real-time analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsArray.length}</div>
            <p className="text-xs text-muted-foreground">From contact form</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sign-ins Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                analyticsArray.filter(
                  (event) =>
                    event.event === "sign_in_success" &&
                    new Date(event.timestamp).toDateString() === new Date().toDateString(),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Successful logins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={isFirebaseConfigured ? "default" : "secondary"}>
                {isFirebaseConfigured ? "Firebase" : "Demo Mode"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Connection status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Analytics Events</CardTitle>
            <CardDescription>Latest user activities and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalytics.length > 0 ? (
                recentAnalytics.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.userId && `User: ${event.userId.slice(0, 8)}...`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No analytics events yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Messages</CardTitle>
            <CardDescription>Latest messages from the contact form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div key={contact.id} className="border-b pb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(contact.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                    <p className="text-sm mt-1">{contact.message.slice(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No contact messages yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
