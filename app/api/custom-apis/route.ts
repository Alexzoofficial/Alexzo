import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customApis } from "@/shared/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch user's custom APIs
export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 401 })
    }

    const apis = await db
      .select()
      .from(customApis)
      .where(eq(customApis.userEmail, userEmail))

    return NextResponse.json({ apis }, { status: 200 })
  } catch (error) {
    console.error("Error fetching custom APIs:", error)
    return NextResponse.json({ error: "Failed to fetch APIs" }, { status: 500 })
  }
}

const createApiSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userName: z.string().optional(),
  userEmail: z.string().email("Valid email required"),
  url: z.string().url("Valid URL required").optional().or(z.literal('')),
  link: z.string().optional(),
})

// POST - Create new custom API
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const validation = createApiSchema.safeParse(data)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { name, userName, userEmail, url, link } = validation.data

    const apiKey = `alexzo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    const result = await db.insert(customApis).values({
      userId: userEmail,
      userName: userName || 'Unknown User',
      userEmail,
      name,
      url: url || null,
      link: link || null,
      status: 'active',
      apiKey,
    }).returning()

    const newApi = result[0]

    return NextResponse.json({
      success: true,
      api: {
        id: newApi.id,
        name: newApi.name,
        userName: newApi.userName,
        userEmail: newApi.userEmail,
        url: newApi.url,
        link: newApi.link,
        status: newApi.status,
        apiKey: newApi.apiKey,
        createdAt: newApi.createdAt,
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
    const userEmail = request.headers.get('x-user-email')

    if (!apiId || !userEmail) {
      return NextResponse.json({ error: "API ID and User email required" }, { status: 400 })
    }

    const apiIdNum = parseInt(apiId, 10)
    if (isNaN(apiIdNum)) {
      return NextResponse.json({ error: "Invalid API ID" }, { status: 400 })
    }

    const api = await db
      .select()
      .from(customApis)
      .where(eq(customApis.id, apiIdNum))
      .limit(1)

    if (api.length === 0) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    if (api[0].userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await db.delete(customApis).where(eq(customApis.id, apiIdNum))

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
    const { apiId, userEmail, status, url, link, name } = data

    if (!apiId || !userEmail || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiIdNum = parseInt(apiId, 10)
    if (isNaN(apiIdNum)) {
      return NextResponse.json({ error: "Invalid API ID" }, { status: 400 })
    }

    const api = await db
      .select()
      .from(customApis)
      .where(eq(customApis.id, apiIdNum))
      .limit(1)

    if (api.length === 0) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    if (api[0].userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData: any = { status, updatedAt: new Date() }
    if (url) updateData.url = url
    if (link) updateData.link = link
    if (name) updateData.name = name

    const result = await db
      .update(customApis)
      .set(updateData)
      .where(eq(customApis.id, apiIdNum))
      .returning()

    return NextResponse.json({ success: true, api: result[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating custom API:", error)
    return NextResponse.json({ error: "Failed to update API" }, { status: 500 })
  }
}
