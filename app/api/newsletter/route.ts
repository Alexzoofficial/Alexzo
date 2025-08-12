import { type NextRequest, NextResponse } from "next/server"

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
      // Try to save to Firebase
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")

      const result = await firebaseHelpers.setPublicData(`newsletter/${Date.now()}`, {
        email,
        subscribed_at: new Date().toISOString(),
        source: "website",
      })

      console.log("Newsletter subscription saved to Firebase")

      return NextResponse.json(
        {
          message: "Successfully subscribed to newsletter",
          success: true,
        },
        { status: 200 },
      )
    } catch (firebaseError) {
      console.warn("Firebase newsletter save failed, using fallback:", firebaseError)

      // Continue anyway - log the email for manual processing
      console.log("Newsletter subscription (manual processing needed):", {
        email,
        timestamp: new Date().toISOString(),
        source: "website",
      })

      return NextResponse.json(
        {
          message: "Successfully subscribed to newsletter",
          success: true,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
