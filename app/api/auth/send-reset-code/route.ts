import { type NextRequest, NextResponse } from "next/server"

// Password reset codes are no longer supported with Google OAuth
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "Password reset codes are no longer supported. Password recovery is handled by Google for Google OAuth users.",
      deprecated: true 
    }, 
    { status: 410 }
  )
}
