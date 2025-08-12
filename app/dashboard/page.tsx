import type { Metadata } from "next"
import { RealtimeDashboard } from "@/components/realtime-dashboard"

export const metadata: Metadata = {
  title: "Dashboard - Alexzo",
  description: "Real-time analytics and management dashboard",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time analytics and management dashboard</p>
      </div>

      <RealtimeDashboard />
    </div>
  )
}
