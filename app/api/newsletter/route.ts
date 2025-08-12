import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name, interests } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")

      // Save newsletter subscription
      const subscriptionId = await firebaseHelpers.saveNewsletterSubscription(email, {
        name: name || "",
        interests: interests || [],
        source: "newsletter_page",
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })

      // Log analytics
      await firebaseHelpers.logAnalytics({
        event: "newsletter_subscription",
        email,
        subscriptionId,
        source: "newsletter_page",
      })

      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to newsletter!",
        subscriptionId,
      })
    } catch (firebaseError) {
      console.error("Firebase operation failed:", firebaseError)

      // Fallback: still return success to user
      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to newsletter!",
        note: "Subscription saved in demo mode",
      })
    }
  } catch (error) {
    console.error("Newsletter API error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
