import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, product, company, useCase } = data

    // Validate required fields
    if (!name || !email || !product) {
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
      const { error } = await supabase.from("waitlist_submissions").insert([
        {
          name,
          email,
          product,
          company: company || null,
          use_case: useCase || null,
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
      console.log("Waitlist submission (manual processing needed):", {
        name,
        email,
        product,
        company,
        useCase,
        timestamp: new Date().toISOString(),
        source: "website",
      })
    }

    return NextResponse.json(
      {
        message: "Successfully joined waitlist",
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Waitlist submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
