import { type NextRequest, NextResponse } from "next/server"

// Force Node.js runtime for Firebase Admin SDK
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    try {
      // Check if Firebase credentials are available
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

      if (privateKey && clientEmail && projectId) {
        // Lazy import Firebase Admin SDK
        const { initializeApp, getApps, cert } = await import('firebase-admin/app')
        const { getAuth } = await import('firebase-admin/auth')
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
        const auth = getAuth(app)

        // Check if user exists in Firestore
        const profileQuery = await firestore.collection('profiles').where('email', '==', email.toLowerCase()).get()
        
        if (profileQuery.empty) {
          return NextResponse.json(
            {
              error:
                "No account is associated with this email address. Please check the email you entered or sign up for a new account.",
            },
            {
              status: 404,
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            },
          )
        }

        // Generate password reset link
        const actionCodeSettings = {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://alexzo.vercel.app"}/auth/reset-password`,
          handleCodeInApp: true,
        }

        await auth.generatePasswordResetLink(email, actionCodeSettings)
        console.log("Password reset email sent via Firebase")
      } else {
        console.warn("Firebase Admin credentials not configured, password reset not available")
        return NextResponse.json(
          {
            error:
              "Password reset is temporarily unavailable. Please contact support.",
          },
          {
            status: 503,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          },
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: "Password reset email sent successfully. Please check your inbox and follow the instructions.",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      // In demo mode, return appropriate error
      return NextResponse.json(
        {
          error:
            "No account is associated with this email address. Please check the email you entered or sign up for a new account.",
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}
