import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Helper to get the catch-all path segment as a string
function getPathString(request: NextRequest): string {
  const url = new URL(request.url)
  // Remove the /api/proxy/ prefix and any trailing slashes
  const cleaned = url.pathname.replace(/^\/api\/proxy\/?/, "").replace(/\/+$/, "")
  return cleaned
}

export async function POST(request: NextRequest) {
  try {
    const pathString = getPathString(request)

    // Only allow generate endpoint
    if (pathString !== "generate") {
      return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => null)
    const { prompt, width = 512, height = 512 } = body || {}

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer alexzo_")) {
      return NextResponse.json({ error: "Invalid API key. Please use a valid alexzo_ API key." }, { status: 401 })
    }

    // Validate dimensions
    if (width < 256 || width > 1024 || height < 256 || height > 1024) {
      return NextResponse.json({ error: "Width and height must be between 256 and 1024 pixels" }, { status: 400 })
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      return NextResponse.json({ error: "Prompt must be less than 1000 characters" }, { status: 400 })
    }

    // Direct call to Pollinations AI - using random seed to ensure unique images
    const seed = Math.floor(Math.random() * 1_000_000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`

    // Return response in standard format
    const response = {
      created: Math.floor(Date.now() / 1000),
      model: "alexzo-ai-v1",
      data: [
        {
          url: imageUrl,
          revised_prompt: prompt,
        },
      ],
    }

    return NextResponse.json(response, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("[v0] API Error:", (error as Error)?.message || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST for image generation." }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed. Use POST for image generation." }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed. Use POST for image generation." }, { status: 405 })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
