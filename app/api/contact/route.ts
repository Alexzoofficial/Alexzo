import { type NextRequest, NextResponse } from "next/server"
import { firebaseHelpers } from "@/lib/firebase-helpers"

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
      // Save contact to Firebase
      const result = await firebaseHelpers.saveContact({
        name,
        email,
        message,
      })

      // Log analytics
      await firebaseHelpers.logAnalytics({
        event: "contact_form_submitted",
        email,
        name,
      })

      return NextResponse.json(
        {
          message: "Contact form submitted successfully",
          success: true,
          id: result.id,
        },
        { status: 200 },
      )
    } catch (firebaseError) {
      console.error("Firebase save failed:", firebaseError)

      // Log the error for manual processing
      console.log("Contact form submission (manual processing needed):", {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        {
          message: "Contact form submitted successfully",
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
