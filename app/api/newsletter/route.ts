import { type NextRequest, NextResponse } from "next/server"

// Force Node.js runtime for Firebase Admin SDK
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    try {
      // Check if Firebase credentials are available
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "alexzo"

      if (privateKey && clientEmail) {
        // Lazy import Firebase Admin SDK to avoid cold compile issues
        const { initializeApp, getApps, cert } = await import('firebase-admin/app')
        const { getFirestore } = await import('firebase-admin/firestore')

        let app
        const apps = getApps()
        if (apps.length > 0) {
          app = apps[0]
        } else {
          app = initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
            databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
          })
        }

        const firestore = getFirestore(app)
        await firestore.collection("newsletter_subscriptions").add({
          email,
          subscribed_at: new Date().toISOString(),
          source: "website",
        })
        console.log("Newsletter subscription saved to Firestore")
      } else {
        console.warn("Firebase Admin credentials not configured, logging subscription for manual processing")
        console.log("Newsletter subscription (manual processing needed):", {
          email,
          timestamp: new Date().toISOString(),
          source: "website",
        })
      }
    } catch (dbError) {
      console.error("Firestore save failed:", dbError)
      // Continue anyway - log the email for manual processing
      console.log("Newsletter subscription (manual processing needed):", {
        email,
        timestamp: new Date().toISOString(),
        source: "website",
      })
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
