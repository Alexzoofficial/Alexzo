import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/server/db"
import { contactSubmissions } from "@/shared/schema"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, subject, category, message, company } = data

    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      await db.insert(contactSubmissions).values({
        name,
        email,
        company: company || null,
        subject,
        category,
        message,
        source: "website",
        status: "new",
      })
      
      console.log("Contact submission saved to database")
    } catch (dbError) {
      console.error("Database save failed:", dbError)
      return NextResponse.json({ error: "Failed to save contact submission" }, { status: 500 })
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
