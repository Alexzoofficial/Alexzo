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
    const currentCount = keyDoc.data().requestCount || 0

    await keyDoc.ref.update({
      lastUsed: new Date().toISOString(),
      requestCount: currentCount + 1
    })

    await db.collection('api_usage').add({
      apiKeyId: keyDoc.id,
      userId: keyDoc.data().userId,
      endpoint: endpoint || 'unknown',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error tracking API usage:", error)
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
