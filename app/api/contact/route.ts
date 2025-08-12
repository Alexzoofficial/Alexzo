import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, userId } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")

      // Save contact message
      const contactId = await firebaseHelpers.saveContact(userId || "anonymous", {
        name,
        email,
        message,
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })

      // Log analytics
      await firebaseHelpers.logAnalytics({
        event: "contact_form_submitted",
        userId: userId || "anonymous",
        contactId,
        email,
      })

      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        contactId,
      })
    } catch (firebaseError) {
      console.error("Firebase operation failed:", firebaseError)

      // Fallback: still return success to user but log the error
      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        note: "Message received in demo mode",
      })
    }
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
