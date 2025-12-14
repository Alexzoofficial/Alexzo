import { NextResponse } from "next/server"
import { z } from "zod"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { apiKeys } from "@shared/schema"
import { eq, and } from "drizzle-orm"

type AuthResult = { userId: string; error: null } | { userId: null; error: "unauthorized" | "unconfigured" }

async function getAuthenticatedUser(requestHeaders: Headers): Promise<AuthResult> {
  const authorization = requestHeaders.get("Authorization")
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return { userId: null, error: "unauthorized" }
  }
  const idToken = authorization.split("Bearer ")[1]

  try {
    const { getAdminAuth } = await import("@/lib/firebase/admin")
    const adminAuth = getAdminAuth()
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return { userId: decodedToken.uid, error: null }
  } catch (error: any) {
    console.error("Error verifying ID token:", error.message)
    if (error.message.includes("Firebase Admin SDK not initialized")) {
      return { userId: null, error: "unconfigured" }
    }
    return { userId: null, error: "unauthorized" }
  }
}

export async function GET(request: Request) {
  const { userId, error } = await getAuthenticatedUser(await headers())

  if (error === "unconfigured") {
    return NextResponse.json(
      { error: "Authentication service is not configured on the server." },
      { status: 503 }
    )
  }

  if (error === "unauthorized" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const keys = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId))
    
    const formattedKeys = keys.map(key => ({
      id: key.id.toString(),
      name: key.name,
      key: key.key,
      created: key.created.toISOString(),
      lastUsed: key.lastUsed ? key.lastUsed.toISOString() : "Never",
    }))
    
    return NextResponse.json(formattedKeys, { status: 200 })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

const createKeySchema = z.object({
  name: z.string().min(1, "Key name is required").max(50, "Key name is too long"),
})

function generateUniqueAPIKey(): string {
  const generatePart = () => Math.random().toString(36).substring(2, 15)
  return `alexzo_${generatePart()}${generatePart()}`
}

export async function POST(request: Request) {
  const { userId, error } = await getAuthenticatedUser(await headers())

  if (error === "unconfigured") {
    return NextResponse.json(
      { error: "Authentication service is not configured on the server." },
      { status: 503 }
    )
  }

  if (error === "unauthorized" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const validation = createKeySchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
  }

  const { name } = validation.data

  try {
    const [newKey] = await db.insert(apiKeys).values({
      userId,
      name,
      key: generateUniqueAPIKey(),
    }).returning()

    return NextResponse.json({
      id: newKey.id.toString(),
      name: newKey.name,
      key: newKey.key,
      created: newKey.created.toISOString(),
      lastUsed: newKey.lastUsed ? newKey.lastUsed.toISOString() : "Never",
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

const deleteKeySchema = z.object({
  id: z.string().min(1, "Key ID is required"),
})

export async function DELETE(request: Request) {
  const { userId, error } = await getAuthenticatedUser(await headers())

  if (error === "unconfigured") {
    return NextResponse.json(
      { error: "Authentication service is not configured on the server." },
      { status: 503 }
    )
  }

  if (error === "unauthorized" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const validation = deleteKeySchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
  }

  const { id } = validation.data
  const keyId = parseInt(id, 10)

  if (isNaN(keyId)) {
    return NextResponse.json({ error: "Invalid key ID" }, { status: 400 })
  }

  try {
    const [existingKey] = await db.select().from(apiKeys).where(
      and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId))
    )

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, keyId))
    return NextResponse.json({ message: "API key deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
