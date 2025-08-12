import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, message } = data

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // Try to save to Firebase
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")

      const result = await firebaseHelpers.createContact({
        name,
        email,
        message,
        source: "website",
        userAgent: request.headers.get("user-agent") || "unknown",
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      })

      console.log("Contact form submission saved to Firebase:", result.id)

      return NextResponse.json(
        {
          message: "Thank you for your message! We'll get back to you soon.",
          success: true,
          id: result.id,
        },
        { status: 200 },
      )
    } catch (firebaseError) {
      console.warn("Firebase contact save failed, using fallback:", firebaseError)

      // Fallback: Log to console and return success
      console.log("Contact form submission (fallback):", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        {
          message: "Thank you for your message! We'll get back to you soon.",
          success: true,
          id: `fallback-${Date.now()}`,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only allow GET requests for admin purposes
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get("admin")

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const { firebaseHelpers } = await import("@/lib/firebase-helpers")
      const contacts = await firebaseHelpers.getContacts()

      return NextResponse.json({
        success: true,
        contacts,
        total: contacts.length,
      })
    } catch (firebaseError) {
      console.warn("Firebase contacts fetch failed:", firebaseError)
      return NextResponse.json({
        success: true,
        contacts: [],
        total: 0,
        message: "Firebase not available, no contacts to display",
      })
    }
  } catch (error) {
    console.error("Contact GET API error:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
