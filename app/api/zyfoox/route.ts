import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase/admin'

// Get user's real IP address from request headers
function getUserIP(request: NextRequest): string {
  // Check common proxy headers in order of reliability
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first (original client)
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  // Fallback to "unknown" if no IP headers found
  return 'unknown'
}

// Validate API key against Firestore
async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; message: string }> {
  try {
    const db = getAdminFirestore()
    if (!db) {
      return { isValid: false, message: 'Firebase admin not configured. Check server logs.' }
    }

    const keysSnapshot = await db
      .collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get()

    if (keysSnapshot.empty) {
        return { isValid: false, message: 'Invalid API key. Key not found.' }
    }

    return { isValid: true, message: 'API key is valid.' }
  } catch (error) {
    return { isValid: false, message: 'Error validating API key. Check server logs.' }
  }
}


export async function POST(request: NextRequest) {
  try {
    // Check authorization header first
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer alexzo_')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please use a valid alexzo_ API key.' },
        { status: 401 }
      )
    }

    // Extract API key
    const apiKey = authHeader.replace('Bearer ', '')
    
    // Validate API key against Firestore
    const validationResult = await validateApiKey(apiKey)
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.message },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { prompt, width = 512, height = 512 } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate dimensions
    if (width < 256 || width > 1024 || height < 256 || height > 1024) {
      return NextResponse.json(
        { error: 'Width and height must be between 256 and 1024 pixels' },
        { status: 400 }
      )
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt must be less than 1000 characters' },
        { status: 400 }
      )
    }

    // Get user's real IP for rate limiting
    const userIp = getUserIP(request)
    
    // Direct call to Pollinations AI - no database, no IP blocking
    // Using random seed to ensure unique images
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`

    // Return the URL directly so client fetches from their own IP
    // This way Pollinations rate limits apply per user, not per server
    const response = {
      created: Math.floor(Date.now() / 1000),
      model: "alexzo-ai-v1",
      data: [
        {
          url: imageUrl,
          revised_prompt: prompt
        }
      ],
      meta: {
        user_ip: userIp,
        note: "Image fetched directly from client to avoid server IP rate limits"
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for image generation.' },
    { status: 405 }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
