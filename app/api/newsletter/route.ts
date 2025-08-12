import { type NextRequest, NextResponse } from "next/server"
import { firebaseHelpers } from "@/lib/firebase-helpers"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // Save to Firebase
      const result = await firebaseHelpers.subscribeNewsletter(email)

      // Log analytics
      await firebaseHelpers.logAnalytics({
        event: "newsletter_subscription",
        email,
        source: "website",
      })

      return NextResponse.json(
        {
          message: "Successfully subscribed to newsletter",
          success: true,
          id: result.id,
        },
        { status: 200 },
      )
    } catch (firebaseError) {
      console.error("Firebase save failed:", firebaseError)

      // Log for manual processing
      console.log("Newsletter subscription (manual processing needed):", {
        email,
        timestamp: new Date().toISOString(),
        source: "website",
      })

      return NextResponse.json(
        {
          message: "Successfully subscribed to newsletter",
          success: true,
          id: `fallback-${Date.now()}`,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
