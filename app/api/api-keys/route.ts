import { NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"
import { z } from "zod"
import { headers } from "next/headers"
import { validateApiKey } from "@/app/api/zyfoox/route"

async function getAuthenticatedUser(requestHeaders: Headers) {
  const authorization = requestHeaders.get("Authorization")
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null
  }
  const idToken = authorization.split("Bearer ")[1]

  const { getAuth } = await import("firebase-admin/auth")
  const { adminAuth } = await import("@/lib/firebase/admin")

  try {
    const decodedToken = await getAuth(adminAuth).verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error("Error verifying ID token:", error)
    return null
  }
}

// GET /api/api-keys - Fetch user's API keys
export async function GET(request: Request) {
  const user = await getAuthenticatedUser(headers())
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const db = getAdminFirestore()
    const keysSnapshot = await db.collection("api_keys").where("userId", "==", user.uid).get()

    if (keysSnapshot.empty) {
      return NextResponse.json([], { status: 200 })
    }

    const keys = keysSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
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


// POST /api/api-keys - Create a new API key
export async function POST(request: Request) {
  const user = await getAuthenticatedUser(headers())
  if (!user) {
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

  const newKey = {
    name,
    key: generateUniqueAPIKey(),
    created: new Date().toISOString(),
    lastUsed: "Never",
    userId: user.uid,
  }

  try {
    const db = getAdminFirestore()
    const docRef = await db.collection("api_keys").add(newKey)
    return NextResponse.json({ id: docRef.id, ...newKey }, { status: 201 })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

const deleteKeySchema = z.object({
  id: z.string().min(1, "Key ID is required"),
})

// DELETE /api/api-keys - Delete an API key
export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser(headers())
  if (!user) {
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

  try {
    const db = getAdminFirestore()
    const keyDocRef = db.collection("api_keys").doc(id)
    const keyDoc = await keyDocRef.get()

    if (!keyDoc.exists) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    if (keyDoc.data()?.userId !== user.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await keyDocRef.delete()
    return NextResponse.json({ message: "API key deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
