import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore, getAdminAuth } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getAuthenticatedUser(request: NextRequest): Promise<{ userId: string; userName: string } | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const idToken = authHeader.replace('Bearer ', '')

  try {
    const auth = getAdminAuth()
    const decodedToken = await auth.verifyIdToken(idToken)
    return {
      userId: decodedToken.uid,
      userName: decodedToken.name || decodedToken.email || 'User'
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getAdminFirestore()
    const keysSnapshot = await db
      .collection('api_keys')
      .where('userId', '==', user.userId)
      .orderBy('created', 'desc')
      .get()

    const formattedKeys = keysSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        key: data.key,
        created: data.created,
        lastUsed: data.lastUsed || null,
        requests: data.requestCount || 0
      }
    })

    return NextResponse.json({ keys: formattedKeys }, { status: 200 })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name } = data

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 })
    }

    const apiKey = `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const created = new Date().toISOString()

    const db = getAdminFirestore()
    const docRef = await db.collection('api_keys').add({
      userId: user.userId,
      userName: user.userName,
      name,
      key: apiKey,
      created,
      lastUsed: null,
      requestCount: 0,
    })

    return NextResponse.json({
      success: true,
      key: {
        id: docRef.id,
        name,
        key: apiKey,
        created,
        lastUsed: null,
        requests: 0
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: "Key ID required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    const docRef = db.collection('api_keys').doc(keyId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 })
    }

    const data = doc.data()
    if (data?.userId !== user.userId) {
      return NextResponse.json({ error: "Key not found or unauthorized" }, { status: 404 })
    }

    await docRef.delete()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
