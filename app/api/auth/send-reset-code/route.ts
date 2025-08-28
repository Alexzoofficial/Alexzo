import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    try {
      const supabase = createRouteHandlerClient({ cookies })

      // Check if user exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, id")
        .eq("email", normalizedEmail)
        .single()

      if (profileError || !profile) {
        return NextResponse.json(
          {
            error:
              "No account found with this email address. Please check the email you entered or create a new account.",
          },
          { status: 404 },
        )
      }

      // Generate verification code
      const code = generateVerificationCode()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

      // Store the reset code in the database
      const { error: insertError } = await supabase.from("password_reset_codes").insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Failed to store reset code:", insertError)
        return NextResponse.json({ error: "Failed to generate reset code" }, { status: 500 })
      }

      // In a real application, you would send the code via email
      // For demo purposes, we'll log it and return it in development
      console.log(`Password reset code for ${normalizedEmail}: ${code}`)

      return NextResponse.json({
        success: true,
        message: "A 6-digit verification code has been sent to your email address. Please check your inbox.",
        // In development mode, include the code for testing
        ...(process.env.NODE_ENV === "development" && { code }),
      })
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Service temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Send reset code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
