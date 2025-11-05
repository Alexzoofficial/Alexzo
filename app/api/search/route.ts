import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase/admin'

// Validate API key against Firestore
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const db = getAdminFirestore()
    if (!db) {
      console.error('Firestore not configured')
      return false
    }

    const keysSnapshot = await db
      .collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get()

    return !keysSnapshot.empty
  } catch (error) {
    console.error('Error validating API key:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
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
    const isValid = await validateApiKey(apiKey)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key. Key not found.' },
        { status: 401 }
      )
    }

    // Get search query from the request
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query (q) is required' },
        { status: 400 }
      )
    }

    // Fetch search results from the external API
    const searchResponse = await fetch(`https://whoogle-bbso.onrender.com/search?q=${encodeURIComponent(query)}&format=json`)

    if (!searchResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: searchResponse.status }
      )
    }

    const searchData = await searchResponse.json()

    return NextResponse.json(searchData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Error in web search API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
