import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const { name, email, subject, category, message } = data

    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      const supabase = createRouteHandlerClient({ cookies })

      // Try to save to database
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name,
          email,
          company: data.company || null,
          subject,
          category,
          message,
          submitted_at: new Date().toISOString(),
          source: "website",
        },
      ])

      if (error) {
        console.error("Database save failed:", error)
        // Continue anyway - don't fail the request
      }
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      // Continue anyway - log the submission for manual processing
      console.log("Contact submission (manual processing needed):", {
        name,
        email,
        company: data.company || "",
        subject,
        category,
        message,
        timestamp: new Date().toISOString(),
        source: "website",
      })
    }

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
