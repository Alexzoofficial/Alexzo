// API Keys management with Firebase Firestore

export interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
  requestCount?: number
}

export async function fetchAPIKeys(userId: string): Promise<APIKey[]> {
  try {
    const response = await fetch('/api/keys', {
      headers: {
        'x-user-id': userId,
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

export async function createAPIKey(userId: string, name: string): Promise<APIKey | null> {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, name }),
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

export async function deleteAPIKey(userId: string, keyId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/keys?id=${keyId}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': userId,
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
