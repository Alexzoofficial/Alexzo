import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { apiKey, endpoint } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const keysSnapshot = await db
      .collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get()

    if (keysSnapshot.empty) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const keyDoc = keysSnapshot.docs[0]

    // Only update lastUsed timestamp, no request counting per user request
    await keyDoc.ref.update({
      lastUsed: new Date().toISOString()
    })

    // No request tracking or api_usage logging per user request
    // User specifically requested: "na hi kitni request I yah sab bhi nahin hona chahie"

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating API usage timestamp:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
