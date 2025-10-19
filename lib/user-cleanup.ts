import { getAdminFirestore } from './firebase/admin'

/**
 * Delete all user data from Firestore when a user is deleted
 * This includes: profile, API keys, custom APIs, and any usage data
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    const db = getAdminFirestore()
    if (!db) {
      console.error('[UserCleanup] Firestore not configured')
      return
    }

    // Delete user profile
    await db.collection('profiles').doc(userId).delete()

    // Delete all user API keys
    const apiKeysSnapshot = await db
      .collection('api_keys')
      .where('userId', '==', userId)
      .get()
    
    const deletePromises: Promise<any>[] = []
    apiKeysSnapshot.docs.forEach(doc => {
      deletePromises.push(doc.ref.delete())
    })

    // Delete all custom APIs
    const customApisSnapshot = await db
      .collection('custom_apis')
      .where('userId', '==', userId)
      .get()
    
    customApisSnapshot.docs.forEach(doc => {
      deletePromises.push(doc.ref.delete())
    })

    // Delete all API usage records (if any exist)
    const apiUsageSnapshot = await db
      .collection('api_usage')
      .where('userId', '==', userId)
      .get()
    
    apiUsageSnapshot.docs.forEach(doc => {
      deletePromises.push(doc.ref.delete())
    })

    // Wait for all deletions to complete
    await Promise.all(deletePromises)

    console.log(`[UserCleanup] Successfully deleted all data for user: ${userId}`)
  } catch (error) {
    console.error('[UserCleanup] Error deleting user data:', error)
    throw error
  }
}
