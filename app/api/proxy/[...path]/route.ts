import { NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase/admin"

// Define allowed origins and create a helper for CORS headers
const ALLOWED_ORIGINS = [
  "https://alexzo.vercel.app", // Production Vercel deployment
  "http://localhost:5000", // Local development
]

// Helper to generate CORS headers safely
const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") || ""
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

// Helper to get the catch-all path segment as a string
function getPathString(request: Request): string {
  const url = new URL(request.url)
  // Remove the /api/proxy/ prefix and any trailing slashes
  const cleaned = url.pathname
    .replace(/^\/api\/proxy\/?/, "")
    .replace(/\/+$/, "")
  return cleaned
}

// Shared validation for API key - validates against Firestore
async function validateApiKey(request: Request): Promise<NextResponse | null> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer alexzo_")) {
    return NextResponse.json(
      { error: "Invalid API key. Please use a valid alexzo_ API key." },
      { status: 401 }
    )
  }

  // Extract the API key
  const apiKey = authHeader.replace("Bearer ", "")

  // Validate against Firestore
  try {
    const db = getAdminFirestore()
    if (!db) {
      console.error("[Proxy] Firestore not configured")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Query the api_keys collection
    const keyDoc = await db.collection("api_keys").doc(apiKey).get()

    if (!keyDoc.exists) {
      return NextResponse.json(
        { error: "Invalid API key. Key not found." },
        { status: 401 }
      )
    }

    // Key is valid, return null to allow request to proceed
    return null
  } catch (error) {
    console.error("[Proxy] Error validating API key:", error)
    return NextResponse.json(
      { error: "Error validating API key" },
      { status: 500 }
    )
  }
}

// Handle image generation endpoints (generate and zyfoox/generate)
async function handleImageGeneration(
  body: any,
  request: Request
): Promise<NextResponse> {
  const { prompt, width = 512, height = 512 } = body || {}

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  // Validate dimensions
  if (width < 256 || width > 1024 || height < 256 || height > 1024) {
    return NextResponse.json(
      { error: "Width and height must be between 256 and 1024 pixels" },
      { status: 400 }
    )
  }

  // Validate prompt length
  if ((prompt as string).length > 1000) {
    return NextResponse.json(
      { error: "Prompt must be less than 1000 characters" },
      { status: 400 }
    )
  }

  // Get user's real IP for rate limiting
  const userIp = getUserIP(request)

  // Generate unique seed for image
  const seed = Math.floor(Math.random() * 1_000_000)

  // Create Pollinations URL with user IP as referrer
  // This ensures rate limits apply per user IP, not server IP
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt as string
  )}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`

  // Return the URL directly so client fetches from their own IP
  // This way Pollinations rate limits apply per user, not per server
  const response = {
    created: Math.floor(Date.now() / 1000),
    model: "alexzo-ai-v1",
    data: [
      {
        url: imageUrl,
        revised_prompt: prompt,
      },
    ],
    meta: {
      user_ip: userIp,
      note: "Image fetched directly from client to avoid server IP rate limits",
    },
  }

  return NextResponse.json(response, {
    headers: getCorsHeaders(request),
  })
}

// Get user's real IP address from request headers
function getUserIP(request: Request): string {
  // Check common proxy headers in order of reliability
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first (original client)
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to "unknown" if no IP headers found
  return "unknown"
}

// Handle chat completions endpoint
async function handleChatCompletions(
  body: any,
  request: Request
): Promise<NextResponse> {
  const {
    messages,
    model = "gpt-3.5-turbo",
    temperature = 0.7,
    max_tokens = 1000,
  } = body || {}

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Messages array is required" },
      { status: 400 }
    )
  }

  // For now, return a simple response
  // In production, this would forward to an actual LLM provider
  const response = {
    id: `chatcmpl-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            "This is a demo response from the Alexzo API proxy. To enable full chat functionality, configure an LLM provider.",
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  }

  return NextResponse.json(response, {
    headers: getCorsHeaders(request),
  })
}

// Track API usage in background (non-blocking)
async function trackUsage(apiKey: string, endpoint: string) {
  try {
    await fetch("https://alexzo.vercel.app/api/keys/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, endpoint }),
    }).catch(() => {})
  } catch {}
}

export async function POST(request: Request) {
  try {
    const pathString = getPathString(request)

    // Validate API key for all endpoints (blocks until validated)
    const authError = await validateApiKey(request)
    if (authError) {
      return authError
    }

    // Extract API key for tracking
    const apiKey =
      request.headers.get("authorization")?.replace("Bearer ", "") || ""

    // Parse request body
    const body = await request.json().catch(() => null)

    // Track usage in background (non-blocking) - only after validation succeeds
    trackUsage(apiKey, pathString)

    // Route to appropriate handler
    if (pathString === "generate" || pathString === "zyfoox/generate") {
      return await handleImageGeneration(body, request)
    } else if (pathString === "chat/completions") {
      return await handleChatCompletions(body, request)
    } else {
      return NextResponse.json(
        {
          error: `Endpoint not found: ${pathString}. Supported endpoints: generate, zyfoox/generate, chat/completions`,
        },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("[Proxy] API Error:", (error as Error)?.message || error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST for image generation." },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST for image generation." },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST for image generation." },
    { status: 405 }
  )
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  })
}
