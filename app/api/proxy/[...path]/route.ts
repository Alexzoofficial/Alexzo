import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Log analytics if Firebase is available
    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      await firebaseHelpers.logAnalytics({
        event: "api_proxy_request",
        path: `/${path}`,
        method: "GET",
        userAgent: request.headers.get("user-agent") || "unknown",
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      })
    } catch (analyticsError) {
      console.log("Analytics logging failed:", analyticsError)
    }

    // Handle different proxy paths
    switch (path) {
      case "health":
        return NextResponse.json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          database: "firebase-realtime",
        })

      case "status":
        return NextResponse.json({
          status: "operational",
          services: {
            api: "healthy",
            database: "firebase-realtime",
            auth: "firebase-auth",
            storage: "firebase-storage",
          },
          timestamp: new Date().toISOString(),
        })

      case "version":
        return NextResponse.json({
          version: "1.0.0",
          build: process.env.VERCEL_GIT_COMMIT_SHA || "local",
          environment: process.env.NODE_ENV || "development",
          database: "firebase-realtime",
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json({ error: `Proxy path '/${path}' not found` }, { status: 404 })
    }
  } catch (error) {
    console.error("Proxy API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    // Log analytics if Firebase is available
    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      await firebaseHelpers.logAnalytics({
        event: "api_proxy_request",
        path: `/${path}`,
        method: "POST",
        userAgent: request.headers.get("user-agent") || "unknown",
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      })
    } catch (analyticsError) {
      console.log("Analytics logging failed:", analyticsError)
    }

    // Handle different proxy paths
    switch (path) {
      case "analytics":
        try {
          const { firebaseHelpers } = await import("@/lib/firebase-helpers")
          const result = await firebaseHelpers.logAnalytics({
            ...body,
          })

          return NextResponse.json({
            success: true,
            id: result?.id || `fallback-${Date.now()}`,
          })
        } catch (firebaseError) {
          console.log("Firebase analytics failed:", firebaseError)
          return NextResponse.json(
            {
              success: false,
              error: "Analytics logging failed",
            },
            { status: 500 },
          )
        }

      case "newsletter":
        try {
          const { firebaseHelpers } = await import("@/lib/firebase-helpers")
          const result = await firebaseHelpers.subscribeNewsletter(body.email)

          return NextResponse.json({
            success: true,
            id: result?.id || `fallback-${Date.now()}`,
            message: "Successfully subscribed to newsletter",
          })
        } catch (firebaseError) {
          console.log("Newsletter subscription failed:", firebaseError)
          return NextResponse.json(
            {
              success: false,
              error: "Newsletter subscription failed",
            },
            { status: 500 },
          )
        }

      default:
        return NextResponse.json({ error: `Proxy path '/${path}' not found` }, { status: 404 })
    }
  } catch (error) {
    console.error("Proxy POST API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
