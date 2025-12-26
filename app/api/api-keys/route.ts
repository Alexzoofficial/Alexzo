import { NextResponse } from "next/server"
import { z } from "zod"
import { headers } from "next/headers"
import { getAdminFirestore } from "@/lib/firebase/admin"

type AuthResult = { userId: string; userName: string; email: string; error: null } | { userId: null; userName: null; email: null; error: string }

export async function GET(request: Request) {
  const headersList = await headers()
  const userEmail = headersList.get("x-user-email")
  
  if (!userEmail) {
    return NextResponse.json({ error: "User email required" }, { status: 400 })
  }

  try {
    const db = getAdminFirestore()
    const keysSnapshot = await db
      .collection('api_keys')
      .where('userId', '==', userEmail)
      .orderBy('created', 'desc')
      .get()

    const keys = keysSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        key: data.key,
        created: data.created,
        lastUsed: data.lastUsed || "Never",
      }
    })
    
    return NextResponse.json(keys, { status: 200 })
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
  const created = new Date().toISOString()

  try {
    const db = getAdminFirestore()
    if (!db) {
      console.error("Firestore database not initialized")
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const docRef = await db.collection('api_keys').add({
      userId: userEmail,
      userName,
      name,
      key: apiKey,
      created,
      lastUsed: null,
    })

    return NextResponse.json({
      id: docRef.id,
      name,
      key: apiKey,
      created,
      lastUsed: "Never",
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating API key:", error.message || error)
    return NextResponse.json({ error: error.message || "Failed to create API key" }, { status: 500 })
  }
}

const deleteKeySchema = z.object({
  id: z.string().min(1, "Key ID is required"),
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
    const db = getAdminFirestore()
    const docRef = db.collection('api_keys').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    const data = doc.data()
    if (data?.userId !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await docRef.delete()
    return NextResponse.json({ message: "API key deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
