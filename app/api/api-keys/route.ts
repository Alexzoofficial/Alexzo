import { NextResponse } from "next/server"
import { z } from "zod"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { apiKeys } from "@/shared/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const headersList = await headers()
  const userEmail = headersList.get("x-user-email")
  
  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
  }

  try {
    const keys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userEmail))
      .orderBy(apiKeys.created)

    return NextResponse.json(
      keys.map(k => ({
        id: k.id,
        name: k.name,
        key: k.key,
        created: k.created,
        lastUsed: k.lastUsed ? new Date(k.lastUsed).toISOString() : "Never",
      })),
      { status: 200 }
    )
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
  const headersList = await headers()
  const userEmail = headersList.get("x-user-email")
  const userName = headersList.get("x-user-name") || "User"
  
  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
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
  const apiKey = generateUniqueAPIKey()

  try {
    const result = await db.insert(apiKeys).values({
      userId: userEmail,
      userName,
      name,
      key: apiKey,
    }).returning()

    const newKey = result[0]
    return NextResponse.json({
      id: newKey.id,
      name: newKey.name,
      key: newKey.key,
      created: newKey.created,
      lastUsed: "Never",
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating API key:", error.message || error)
    return NextResponse.json({ error: error.message || "Failed to create API key" }, { status: 500 })
  }
}

const deleteKeySchema = z.object({
  id: z.coerce.number().positive("Valid Key ID is required"),
})

export async function DELETE(request: Request) {
  const headersList = await headers()
  const userEmail = headersList.get("x-user-email")
  
  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
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

  try {
    const key = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.id, id))
      .limit(1)

    if (key.length === 0) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    if (key[0].userId !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, id))
    return NextResponse.json({ message: "API key deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
