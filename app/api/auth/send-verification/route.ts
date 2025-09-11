import { type NextRequest, NextResponse } from "next/server"

// Email verification system has been disabled in favor of Google OAuth
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Email verification is no longer supported. Please use Google sign-in instead.",
      deprecated: true 
    }, 
    { status: 410 }
  )
}
