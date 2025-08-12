import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Log analytics for API usage
    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      await firebaseHelpers.logAnalytics({
        event: "api_proxy_request",
        path: `/api/proxy/${path}`,
        method: "GET",
        userAgent: request.headers.get("user-agent") || "unknown",
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })
    } catch (analyticsError) {
      console.log("Analytics logging failed:", analyticsError)
    }

    // Handle different proxy endpoints
    switch (path) {
      case "health":
        return NextResponse.json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          service: "alexzo-api-proxy",
        })

      case "status":
        return NextResponse.json({
          status: "operational",
          version: "1.0.0",
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        })

      case "newsletter":
        // Handle newsletter subscription via proxy
        return NextResponse.json({
          message: "Use POST method for newsletter subscription",
          endpoint: "/api/newsletter",
        })

      default:
        return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("API Proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Log analytics for API usage
    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      await firebaseHelpers.logAnalytics({
        event: "api_proxy_request",
        path: `/api/proxy/${path}`,
        method: "POST",
        userAgent: request.headers.get("user-agent") || "unknown",
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })
    } catch (analyticsError) {
      console.log("Analytics logging failed:", analyticsError)
    }

    switch (path) {
      case "newsletter":
        // Proxy to newsletter API
        const newsletterData = await request.json()
        const newsletterResponse = await fetch(`${request.nextUrl.origin}/api/newsletter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newsletterData),
        })

        const newsletterResult = await newsletterResponse.json()
        return NextResponse.json(newsletterResult, { status: newsletterResponse.status })

      case "contact":
        // Proxy to contact API
        const contactData = await request.json()
        const contactResponse = await fetch(`${request.nextUrl.origin}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        })

        const contactResult = await contactResponse.json()
        return NextResponse.json(contactResult, { status: contactResponse.status })

      default:
        return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("API Proxy POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
