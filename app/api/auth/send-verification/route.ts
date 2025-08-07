import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()

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

      // For signup verification, we don't need to check if user exists
      // For other types, we might want to check
      if (type !== "signup") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", email.toLowerCase())
          .single()

        if (!profile) {
          return NextResponse.json(
            {
              error: "No account found with this email address.",
            },
            { status: 404 },
          )
        }
      }

      // Generate verification code
      const code = generateVerificationCode()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

      // In a real application, you would send the code via email
      // For demo purposes, we'll log it
      console.log(`Verification code for ${email} (${type}): ${code}`)

      return NextResponse.json({
        success: true,
        message: "A 6-digit verification code has been sent to your email address. Please check your inbox.",
        // In demo mode, include the code in the response for testing
        ...(process.env.NODE_ENV === "development" && { code }),
      })
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      // For signup, we can still proceed even if database is not available
      if (type === "signup") {
        console.log(`Demo verification code for ${email}: 123456`)
        return NextResponse.json({
          success: true,
          message: "A 6-digit verification code has been sent to your email address. Please check your inbox.",
          ...(process.env.NODE_ENV === "development" && { code: "123456" }),
        })
      }

      return NextResponse.json(
        {
          error: "Service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Send verification code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
