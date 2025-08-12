import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}

// Log analytics event
async function logAnalyticsEvent(request: NextRequest, path: string[], data: any) {
  try {
    await dbHelpers.logAnalytics({
      event_type: "api_request",
      data: {
        path: path.join("/"),
        method: request.method,
        ...data,
      },
      ip_address: getClientIP(request),
      user_agent: request.headers.get("user-agent") || "unknown",
    })
  } catch (error) {
    console.error("Failed to log analytics:", error)
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params

  try {
    // Log the API request
    await logAnalyticsEvent(request, path, { status: "started" })

    // Handle different API endpoints
    if (path[0] === "health") {
      return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        path: path.join("/"),
      })
    }

    if (path[0] === "public") {
      // Handle public data requests
      const key = path[1]
      const data = await dbHelpers.getPublicData(key)

      await logAnalyticsEvent(request, path, { status: "success", key })

      return NextResponse.json({ data })
    }

    // Default response for unknown endpoints
    await logAnalyticsEvent(request, path, { status: "not_found" })

    return NextResponse.json({ error: "Endpoint not found", path: path.join("/") }, { status: 404 })
  } catch (error) {
    console.error("API Proxy Error:", error)

    await logAnalyticsEvent(request, path, {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params

  try {
    const body = await request.json()

    // Log the API request
    await logAnalyticsEvent(request, path, { status: "started", body })

    if (path[0] === "public") {
      // Handle public data updates
      const key = path[1]
      const data = await dbHelpers.setPublicData(key, body)

      await logAnalyticsEvent(request, path, { status: "success", key })

      return NextResponse.json({ data })
    }

    // Default response for unknown endpoints
    await logAnalyticsEvent(request, path, { status: "not_found" })

    return NextResponse.json({ error: "Endpoint not found", path: path.join("/") }, { status: 404 })
  } catch (error) {
    console.error("API Proxy Error:", error)

    await logAnalyticsEvent(request, path, {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return POST(request, { params })
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const { path } = params

  try {
    // Log the API request
    await logAnalyticsEvent(request, path, { status: "started" })

    // Handle delete operations
    await logAnalyticsEvent(request, path, { status: "success" })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Proxy Error:", error)

    await logAnalyticsEvent(request, path, {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
