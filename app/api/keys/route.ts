import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const keysSnapshot = await db
      .collection('api_keys')
      .where('userId', '==', userId)
      .orderBy('created', 'desc')
      .get()

    const keys = keysSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ keys }, { status: 200 })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, name } = data

    if (!userId || !name) {
      return NextResponse.json({ error: "User ID and name required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apiKey = `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    const newKey = {
      userId,
      name,
      key: apiKey,
      created: new Date().toISOString(),
      lastUsed: null,
    }

    const docRef = await db.collection('api_keys').add(newKey)

    return NextResponse.json({
      success: true,
      key: {
        id: docRef.id,
        ...newKey
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')
    const userId = request.headers.get('x-user-id')

    if (!keyId || !userId) {
      return NextResponse.json({ error: "Key ID and User ID required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const keyDoc = await db.collection('api_keys').doc(keyId).get()
    
    if (!keyDoc.exists || keyDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Key not found or unauthorized" }, { status: 404 })
    }

    await db.collection('api_keys').doc(keyId).delete()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
