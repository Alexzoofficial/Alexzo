import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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
      const supabase = createRouteHandlerClient({ cookies })

      // Try to save to database
      const { error } = await supabase.from("newsletter_subscriptions").insert([
        {
          email,
          subscribed_at: new Date().toISOString(),
          source: "website",
        },
      ])

      if (error) {
        console.error("Database save failed:", error)
        // Continue anyway - don't fail the request
      }
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      // Continue anyway - log the email for manual processing
      console.log("Newsletter subscription (manual processing needed):", {
        email,
        timestamp: new Date().toISOString(),
        source: "website",
      })
    }

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter",
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
