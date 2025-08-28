import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Email, code, and new password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 })
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    try {
      const supabase = createRouteHandlerClient({ cookies })

      // Find valid reset code
      const { data: resetCode, error: codeError } = await supabase
        .from("password_reset_codes")
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("code", code)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (codeError || !resetCode) {
        return NextResponse.json(
          { error: "Invalid or expired verification code. Please request a new one." },
          { status: 400 },
        )
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update user's password
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          password_hash: hashedPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email.toLowerCase())

      if (updateError) {
        console.error("Failed to update password:", updateError)
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
      }

      // Mark the code as used
      await supabase.from("password_reset_codes").update({ used: true }).eq("id", resetCode.id)

      return NextResponse.json({
        success: true,
        message: "Password has been reset successfully. You can now sign in with your new password.",
      })
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      return NextResponse.json({ error: "Service temporarily unavailable. Please try again later." }, { status: 503 })
    }
  } catch (error) {
    console.error("Verify reset code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
