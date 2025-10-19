// API Keys management with Firebase Firestore
import { auth } from '@/lib/firebase/client'

export interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
  requestCount?: number
}

export async function fetchAPIKeys(): Promise<APIKey[]> {
  try {
    const idToken = await auth?.currentUser?.getIdToken()
    if (!idToken) {
      throw new Error('Not authenticated')
    }

    const response = await fetch('/api/keys', {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch API keys')
    }

    const data = await response.json()
    return data.keys || []
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return []
  }
}

export async function createAPIKey(name: string): Promise<APIKey | null> {
  try {
    const idToken = await auth?.currentUser?.getIdToken()
    if (!idToken) {
      throw new Error('Not authenticated')
    }

    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error('Failed to create API key')
    }

    const data = await response.json()
    return data.key
  } catch (error) {
    console.error('Error creating API key:', error)
    return null
  }
}

export async function deleteAPIKey(keyId: string): Promise<boolean> {
  try {
    const idToken = await auth?.currentUser?.getIdToken()
    if (!idToken) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`/api/keys?id=${keyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete API key')
    }

    return true
  } catch (error) {
    console.error('Error deleting API key:', error)
    return false
  }
}
