import type { Metadata } from "next"
import { RealtimeDashboard } from "@/components/realtime-dashboard"

export const metadata: Metadata = {
  title: "Dashboard - Alexzo",
  description: "Real-time analytics and contact management dashboard",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor real-time analytics, contact messages, and system status.</p>
          </div>
          <RealtimeDashboard />
        </div>
      </div>
    </div>
  )
}
