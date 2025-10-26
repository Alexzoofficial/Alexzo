import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch user's custom APIs
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

    const apisSnapshot = await db
      .collection('custom_apis')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const apis = apisSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ apis }, { status: 200 })
  } catch (error) {
    console.error("Error fetching custom APIs:", error)
    return NextResponse.json({ error: "Failed to fetch APIs" }, { status: 500 })
  }
}

// POST - Create new custom API
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, userName, userEmail, name, model } = data

    if (!userId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apiKey = `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    const newAPI = {
      userId,
      userName: userName || 'Unknown User',
      userEmail: userEmail || '',
      name,
      model: model || 'Not Specified',
      status: 'active',
      createdAt: new Date().toISOString(),
      apiKey,
    }

    const docRef = await db.collection('custom_apis').add(newAPI)

    return NextResponse.json({
      success: true,
      api: {
        id: docRef.id,
        ...newAPI
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating custom API:", error)
    return NextResponse.json({ error: "Failed to create API" }, { status: 500 })
  }
}

// DELETE - Delete custom API
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    const userId = request.headers.get('x-user-id')

    if (!apiId || !userId) {
      return NextResponse.json({ error: "API ID and User ID required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apiDoc = await db.collection('custom_apis').doc(apiId).get()

    if (!apiDoc.exists) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    if (apiDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await apiDoc.ref.delete()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting custom API:", error)
    return NextResponse.json({ error: "Failed to delete API" }, { status: 500 })
  }
}

// PATCH - Update custom API status
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { apiId, userId, status } = data

    if (!apiId || !userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const apiDoc = await db.collection('custom_apis').doc(apiId).get()

    if (!apiDoc.exists) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    if (apiDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await apiDoc.ref.update({ status })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating custom API:", error)
    return NextResponse.json({ error: "Failed to update API" }, { status: 500 })
  }
}
