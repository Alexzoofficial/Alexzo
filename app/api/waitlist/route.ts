import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, email, product, company, useCase } = data

    if (!name || !email || !product) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      const db = getAdminFirestore()
      if (db) {
        await db.collection('waitlist_submissions').add({
          name,
          email,
          product,
          company: company || null,
          useCase: useCase || null,
          source: "website",
          status: "pending",
          submittedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        
        console.log("Waitlist submission saved to Firebase Firestore")
      } else {
        console.warn("Firebase not configured, skipping database save")
      }
    } catch (dbError) {
      console.error("Firebase save failed:", dbError)
      return NextResponse.json({ error: "Failed to save waitlist submission" }, { status: 500 })
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
