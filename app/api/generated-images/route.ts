import { type NextRequest, NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch user's generated images
export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 401 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const imagesSnapshot = await db
      .collection('generated_images')
      .where('userEmail', '==', userEmail)
      .orderBy('createdAt', 'desc')
      .get()

    const images = imagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ images }, { status: 200 })
  } catch (error) {
    console.error("Error fetching generated images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

// POST - Save generated image
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userEmail, prompt, imageUrl } = data

    if (!userEmail || !prompt || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const newImage = {
      userEmail,
      prompt,
      imageUrl,
      createdAt: new Date().toISOString(),
    }

    const docRef = await db.collection('generated_images').add(newImage)

    return NextResponse.json({
      success: true,
      image: {
        id: docRef.id,
        ...newImage
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Error saving generated image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
}

// DELETE - Delete generated image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('id')
    const userEmail = request.headers.get('x-user-email')

    if (!imageId || !userEmail) {
      return NextResponse.json({ error: "Image ID and User email required" }, { status: 400 })
    }

    const db = getAdminFirestore()
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const imageDoc = await db.collection('generated_images').doc(imageId).get()

    if (!imageDoc.exists) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    if (imageDoc.data()?.userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await imageDoc.ref.delete()

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting generated image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
