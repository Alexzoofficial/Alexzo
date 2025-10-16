import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/server/db"
import { newsletterSubscriptions } from "@/shared/schema"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      await db.insert(newsletterSubscriptions).values({
        email,
        source: "website",
        active: true,
      })
      
      console.log("Newsletter subscription saved to database")
    } catch (dbError: any) {
      if (dbError?.code === '23505') {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
      }
      console.error("Database save failed:", dbError)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
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
