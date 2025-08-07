import { type NextRequest, NextResponse } from "next/server"

// This endpoint allows us to proxy analytics requests
// to keep API keys and tracking IDs private
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Here we can process analytics data securely
    // without exposing our tracking IDs

    // Example: forward to Google Analytics
    if (process.env.GA_API_SECRET) {
      const params = new URLSearchParams({
        measurement_id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
        api_secret: process.env.GA_API_SECRET,
      })

      await fetch(`https://www.google-analytics.com/mp/collect?${params.toString()}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to process analytics" }, { status: 500 })
  }
}
