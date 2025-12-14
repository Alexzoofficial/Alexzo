import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { apiKeys } from "@shared/schema"
import { eq, and, desc } from "drizzle-orm"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getAuthenticatedUser(request: NextRequest): Promise<{ userId: string; userName: string } | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const idToken = authHeader.replace('Bearer ', '')

  try {
    const { getAdminAuth } = await import("@/lib/firebase/admin")
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

    const keys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.userId))
      .orderBy(desc(apiKeys.created))

    const formattedKeys = keys.map(key => ({
      id: key.id.toString(),
      name: key.name,
      key: key.key,
      created: key.created.toISOString(),
      lastUsed: key.lastUsed ? key.lastUsed.toISOString() : null,
      requests: key.requestCount || 0
    }))

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

    const [newKey] = await db.insert(apiKeys).values({
      userId: user.userId,
      userName: user.userName,
      name,
      key: apiKey,
    }).returning()

    return NextResponse.json({
      success: true,
      key: {
        id: newKey.id.toString(),
        name: newKey.name,
        key: newKey.key,
        created: newKey.created.toISOString(),
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

    const numericId = parseInt(keyId, 10)
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid key ID" }, { status: 400 })
    }

    const [existingKey] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.id, numericId), eq(apiKeys.userId, user.userId)))

    if (!existingKey) {
      return NextResponse.json({ error: "Key not found or unauthorized" }, { status: 404 })
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, numericId))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
