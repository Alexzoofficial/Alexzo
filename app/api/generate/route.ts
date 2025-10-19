import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase/admin'

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

// Validate API key against Firestore and return user info
async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; userId?: string; apiKeyName?: string }> {
  try {
    const db = getAdminFirestore()
    if (!db) {
      console.error('[Generate] Firestore not configured')
      return { isValid: false }
    }

    // Query the api_keys collection by key field (consistent with /api/keys/track)
    const keysSnapshot = await db
      .collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get()

    if (keysSnapshot.empty) {
      return { isValid: false }
    }

    const keyData = keysSnapshot.docs[0].data()
    return {
      isValid: true,
      userId: keyData.userId,
      apiKeyName: keyData.name
    }
  } catch (error) {
    console.error('[Generate] Error validating API key:', error)
    return { isValid: false }
  }
}

// Get user profile information from Firestore
async function getUserProfile(userId: string): Promise<{ userName?: string; userEmail?: string }> {
  try {
    const db = getAdminFirestore()
    if (!db) {
      console.warn('[Generate] Firestore not configured, skipping user profile lookup')
      return {}
    }

    const userDoc = await db.collection('profiles').doc(userId).get()
    
    if (!userDoc.exists) {
      console.warn('[Generate] User profile not found for userId:', userId)
      return {}
    }

    const userData = userDoc.data()
    return {
      userName: userData?.full_name || 'Unknown User',
      userEmail: userData?.email || ''
    }
  } catch (error) {
    console.error('[Generate] Error fetching user profile:', error)
    return {}
  }
}

// Save generation request to Firestore (metadata only, NO image data, NO errors)
async function saveGenerationRequest(data: {
  userId: string
  userName: string
  userEmail: string
  apiKey: string
  apiKeyName: string
  prompt: string
  width: number
  height: number
  model: string
}) {
  try {
    const db = getAdminFirestore()
    if (!db) {
      return
    }

    await db.collection('api_usage').add({
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      apiKey: data.apiKey,
      apiKeyName: data.apiKeyName,
      prompt: data.prompt,
      width: data.width,
      height: data.height,
      model: data.model,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
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
    
    // Validate API key against Firestore and get user info
    const validationResult = await validateApiKey(apiKey)
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Invalid API key. Key not found.' },
        { status: 401 }
      )
    }

    const userId = validationResult.userId
    const apiKeyName = validationResult.apiKeyName || 'Unknown'

    // Get user profile information
    const userProfile = userId ? await getUserProfile(userId) : {}
    const userName = userProfile.userName || 'Unknown User'
    const userEmail = userProfile.userEmail || ''

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

    // Track usage in background (non-blocking) - only after validation succeeds
    trackUsage(apiKey)

    // Direct call to Pollinations AI - no database, no IP blocking
    // Using random seed to ensure unique images
    const seed = Math.floor(Math.random() * 1000000)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`

    // Save generation request to Firestore (metadata only, NO image data/URL)
    if (userId) {
      await saveGenerationRequest({
        userId,
        userName,
        userEmail,
        apiKey,
        apiKeyName,
        prompt,
        width,
        height,
        model: 'alexzo-ai-v1'
      })
    }

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
