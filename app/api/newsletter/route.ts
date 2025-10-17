import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

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
      const db = getAdminFirestore()
      if (db) {
        // Check if email already exists
        const existingSubscription = await db.collection('newsletter_subscriptions')
          .where('email', '==', email)
          .get()
        
        if (!existingSubscription.empty) {
          return NextResponse.json({ error: "Email already subscribed" }, { status: 409 })
        }
        
        await db.collection('newsletter_subscriptions').add({
          email,
          source: "website",
          active: true,
          subscribedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        
        console.log("Newsletter subscription saved to Firebase Firestore")
      } else {
        console.warn("Firebase not configured, skipping database save")
      }
    } catch (dbError) {
      console.error("Firebase save failed:", dbError)
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
