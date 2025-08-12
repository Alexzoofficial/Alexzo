"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Users, MessageSquare, BarChart3, Trash2, Eye } from "lucide-react"
import { subscribeToTable, dbHelpers } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
  user_id?: string
}

interface AnalyticsEvent {
  id: string
  event_type: string
  data: any
  user_id?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export default function RealtimeDashboard() {
  const { user, isSupabaseConfigured } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        // Load contacts
        const contactsData = await dbHelpers.getContacts(user.id)
        setContacts(contactsData)

        // Load analytics (admin only)
        try {
          const analyticsData = await dbHelpers.getAnalytics()
          setAnalytics(analyticsData)
          setIsAdmin(true)
        } catch (error) {
          // User is not admin, can't access analytics
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()

    if (isSupabaseConfigured) {
      // Set up real-time subscriptions
      const contactsSubscription = subscribeToTable("contacts", (payload) => {
        console.log("Contacts update:", payload)

        if (payload.eventType === "INSERT") {
          setContacts((prev) => [payload.new, ...prev])
          toast.success("New contact received!")
        } else if (payload.eventType === "UPDATE") {
          setContacts((prev) => prev.map((contact) => (contact.id === payload.new.id ? payload.new : contact)))
        } else if (payload.eventType === "DELETE") {
          setContacts((prev) => prev.filter((contact) => contact.id !== payload.old.id))
        }
      })

      const analyticsSubscription = subscribeToTable("analytics", (payload) => {
        console.log("Analytics update:", payload)

        if (payload.eventType === "INSERT" && isAdmin) {
          setAnalytics((prev) => [payload.new, ...prev.slice(0, 99)]) // Keep only latest 100
          toast.info("New analytics event recorded")
        }
      })

      return () => {
        contactsSubscription.unsubscribe()
        analyticsSubscription.unsubscribe()
      }
    }
  }, [user, isSupabaseConfigured, isAdmin])

  const deleteContact = async (contactId: string) => {
    try {
      // In a real app, you'd call an API to delete
      // For now, just remove from local state
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId))
      toast.success("Contact deleted")
    } catch (error) {
      toast.error("Failed to delete contact")
    }
  }

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      // In a real app, you'd call an API to update
      setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, status } : contact)))
      toast.success("Contact status updated")
    } catch (error) {
      toast.error("Failed to update contact status")
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Please sign in to view the dashboard</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{contacts.length}</div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Live updates
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{contacts.filter((c) => c.status === "new").length}</div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Eye className="h-3 w-3 mr-1" />
              Unread
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1</div>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Online now
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Analytics Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.length}</div>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Activity className="h-3 w-3 mr-1" />
                Real-time
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="contacts" className="data-[state=active]:bg-purple-600">
            Contacts ({contacts.length})
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics ({analytics.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No contacts yet</p>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{contact.name}</h4>
                          <p className="text-sm text-gray-400">{contact.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={contact.status === "new" ? "default" : "secondary"}
                            className={
                              contact.status === "new" ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                            }
                          >
                            {contact.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{contact.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{new Date(contact.created_at).toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus(contact.id, "read")}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Mark as Read
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus(contact.id, "replied")}
                            className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                          >
                            Mark as Replied
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Analytics Events</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No analytics events yet</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.slice(0, 20).map((event) => (
                      <div key={event.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-orange-600 text-orange-300">
                            {event.event_type}
                          </Badge>
                          <p className="text-xs text-gray-500">{new Date(event.created_at).toLocaleString()}</p>
                        </div>
                        {event.data && (
                          <pre className="text-xs text-gray-400 bg-gray-900/50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        )}
                        {event.ip_address && <p className="text-xs text-gray-500 mt-1">IP: {event.ip_address}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Real-time Status */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">
                {isSupabaseConfigured ? "Real-time updates active" : "Demo mode - simulated updates"}
              </span>
            </div>
            <Badge variant="outline" className="border-green-600 text-green-300">
              Live
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
