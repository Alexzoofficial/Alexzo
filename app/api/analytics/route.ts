import { type NextRequest, NextResponse } from "next/server"

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const gaApiSecret = process.env.GA_API_SECRET
    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    if (!gaApiSecret || !gaMeasurementId) {
      console.warn("Google Analytics not configured - skipping analytics")
      return NextResponse.json({ success: true, message: "Analytics not configured" })
    }

    const params = new URLSearchParams({
      measurement_id: gaMeasurementId,
      api_secret: gaApiSecret,
    })

    const response = await fetch(`https://www.google-analytics.com/mp/collect?${params.toString()}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`GA API responded with status: ${response.status}`)
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to process analytics" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}
