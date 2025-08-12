"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { firebaseHelpers } from "@/lib/firebase-helpers"
import { useAuth } from "@/lib/auth-context"

interface AnalyticsData {
  [key: string]: {
    event: string
    timestamp: any
    path?: string
    method?: string
    userAgent?: string
    ip?: string
  }
}

interface ContactData {
  [key: string]: {
    name: string
    email: string
    message: string
    timestamp: any
  }
}

export function RealtimeDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({})
  const [contacts, setContacts] = useState<ContactData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Subscribe to analytics (admin only)
    const unsubscribeAnalytics = firebaseHelpers.subscribeToAnalytics((data) => {
      setAnalytics(data || {})
      setLoading(false)
    })

    // Subscribe to user's contacts
    const unsubscribeContacts = firebaseHelpers.subscribeToContacts((data) => {
      setContacts(data || {})
    }, user.uid)

    return () => {
      unsubscribeAnalytics()
      unsubscribeContacts()
    }
  }, [user])

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const analyticsArray = Object.entries(analytics).map(([key, value]) => ({
    id: key,
    ...value,
  }))

  const contactsArray = Object.entries(contacts).map(([key, value]) => ({
    id: key,
    ...value,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analytics Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsArray.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactsArray.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                analyticsArray.filter((a) => {
                  const timestamp = a.timestamp?.seconds ? new Date(a.timestamp.seconds * 1000) : new Date(a.timestamp)
                  return Date.now() - timestamp.getTime() < 24 * 60 * 60 * 1000
                }).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">Active</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Analytics</CardTitle>
            <CardDescription>Latest analytics events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {analyticsArray
                .slice(-10)
                .reverse()
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{event.event}</p>
                      {event.path && <p className="text-sm text-muted-foreground">{event.path}</p>}
                    </div>
                    <Badge variant="outline">{event.method || "N/A"}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contactsArray
                .slice(-10)
                .reverse()
                .map((contact) => (
                  <div key={contact.id} className="p-2 border rounded">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">{contact.message.substring(0, 100)}...</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
