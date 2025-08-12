import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    try {
      const supabase = createRouteHandlerClient({ cookies })

      // First check if user exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email.toLowerCase())
        .single()

      if (!profile) {
        return NextResponse.json(
          {
            error:
              "No account is associated with this email address. Please check the email you entered or sign up for a new account.",
          },
          { status: 404 },
        )
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://alexzo.vercel.app"}/auth/reset-password`,
      })

      if (error) {
        console.error("Password reset failed:", error)
        return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Password reset email sent successfully. Please check your inbox and follow the instructions.",
      })
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      // In demo mode, return appropriate error
      return NextResponse.json(
        {
          error:
            "No account is associated with this email address. Please check the email you entered or sign up for a new account.",
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
