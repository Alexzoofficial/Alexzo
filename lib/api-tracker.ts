export function trackAPIRequest(userId: string, apiKey: string, storageType: 'api_keys' | 'passport_keys' = 'api_keys') {
  if (typeof window === 'undefined') return

  try {
    const storageKey = `${storageType}_${userId}`
    const savedKeys = localStorage.getItem(storageKey)
    
    if (!savedKeys) return

    const apiKeys = JSON.parse(savedKeys)
    const keyIndex = apiKeys.findIndex((k: any) => k.key === apiKey)
    
    if (keyIndex === -1) return

    apiKeys[keyIndex].requests = (apiKeys[keyIndex].requests || 0) + 1
    apiKeys[keyIndex].lastUsed = new Date().toISOString()

    localStorage.setItem(storageKey, JSON.stringify(apiKeys))
    
    window.dispatchEvent(new CustomEvent('api-key-updated', { 
      detail: { userId, apiKey, storageType } 
    }))
  } catch (error) {
    console.error('Failed to track API request:', error)
  }
}

export function useAPIKeyUpdates(userId: string | null, callback: () => void) {
  if (typeof window === 'undefined' || !userId) return

  const handleUpdate = (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail.userId === userId) {
      callback()
    }
  }

  window.addEventListener('api-key-updated', handleUpdate)
  return () => window.removeEventListener('api-key-updated', handleUpdate)
}
