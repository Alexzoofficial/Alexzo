import { NextRequest, NextResponse } from 'next/server'

// Track API usage in background (non-blocking)
async function trackUsage(apiKey: string) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/api/keys/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, endpoint: 'generate' }),
    }).catch(() => {})
  } catch {}
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, width = 512, height = 512 } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Check authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer alexzo_')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please use a valid alexzo_ API key.' },
        { status: 401 }
      )
    }

    // Extract API key for tracking
    const apiKey = authHeader.replace('Bearer ', '')
    
    // Track usage in background (non-blocking)
    trackUsage(apiKey)

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

    // Direct call to Pollinations AI - no database, no IP blocking
    // Using random seed to ensure unique images
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`

    // Return response in standard format
    const response = {
      created: Math.floor(Date.now() / 1000),
      model: "alexzo-ai-v1",
      data: [
        {
          url: imageUrl,
          revised_prompt: prompt
        }
      ]
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('API Error:', error)
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
