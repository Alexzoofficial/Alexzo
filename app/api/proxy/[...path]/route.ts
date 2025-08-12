import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Health check endpoint
    if (path === "health") {
      return NextResponse.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        firebase: "connected",
      })
    }

    // Analytics endpoint
    if (path === "analytics") {
      try {
        const { firebaseHelpers } = await import("@/lib/firebase-helpers")
        await firebaseHelpers.logAnalytics({
          event: "api_proxy_access",
          path: path,
          method: "GET",
          userAgent: request.headers.get("user-agent"),
          ip: request.headers.get("x-forwarded-for") || "unknown",
        })
      } catch (error) {
        console.error("Analytics logging failed:", error)
      }

      return NextResponse.json({
        message: "Analytics logged",
        timestamp: new Date().toISOString(),
      })
    }

    // Status endpoint
    if (path === "status") {
      return NextResponse.json({
        api: "online",
        database: "connected",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      })
    }

    return NextResponse.json({ error: "Endpoint not found", path }, { status: 404 })
  } catch (error) {
    console.error("API Proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    // Log analytics for POST requests
    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      await firebaseHelpers.logAnalytics({
        event: "api_proxy_post",
        path: path,
        method: "POST",
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || "unknown",
        bodySize: JSON.stringify(body).length,
      })
    } catch (error) {
      console.error("Analytics logging failed:", error)
    }

    return NextResponse.json({
      message: "POST request processed",
      path,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Proxy POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
