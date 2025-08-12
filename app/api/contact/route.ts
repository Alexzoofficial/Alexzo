import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Create contact
    const contact = await dbHelpers.createContact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Log analytics
    await dbHelpers.logAnalytics({
      event_type: "contact_form_submission",
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message_length: message.trim().length,
      },
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      contact,
    })
  } catch (error) {
    console.error("Contact form error:", error)

    // Log error analytics
    try {
      await dbHelpers.logAnalytics({
        event_type: "contact_form_error",
        data: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
      })
    } catch (logError) {
      console.error("Failed to log error analytics:", logError)
    }

    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
