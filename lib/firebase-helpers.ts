import { ref, push, set, get, onValue, off, serverTimestamp } from "firebase/database"
import { database } from "./firebase"

export interface AnalyticsData {
  event: string
  path?: string
  method?: string
  userAgent?: string
  ip?: string
  timestamp?: string | object
  [key: string]: any
}

export interface ContactData {
  name: string
  email: string
  message: string
  timestamp?: string | object
}

export interface NewsletterData {
  email: string
  timestamp?: string | object
  source?: string
}

export const firebaseHelpers = {
  // Analytics functions
  async logAnalytics(data: AnalyticsData) {
    try {
      const analyticsRef = ref(database, "analytics")
      const newAnalyticsRef = push(analyticsRef)

      await set(newAnalyticsRef, {
        ...data,
        timestamp: serverTimestamp(),
      })

      return { id: newAnalyticsRef.key }
    } catch (error) {
      console.error("Error logging analytics:", error)
      throw error
    }
  },

  // Contact functions
  async saveContact(contactData: ContactData, userId?: string) {
    try {
      const contactsRef = userId ? ref(database, `contacts/${userId}`) : ref(database, "public/contacts")

      const newContactRef = push(contactsRef)

      await set(newContactRef, {
        ...contactData,
        timestamp: serverTimestamp(),
      })

      return { id: newContactRef.key }
    } catch (error) {
      console.error("Error saving contact:", error)
      throw error
    }
  },

  // Newsletter functions
  async subscribeNewsletter(email: string) {
    try {
      const newsletterRef = ref(database, "public/newsletter")
      const newSubscriptionRef = push(newsletterRef)

      await set(newSubscriptionRef, {
        email,
        timestamp: serverTimestamp(),
        source: "website",
      })

      return { id: newSubscriptionRef.key }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      throw error
    }
  },

  // Profile functions
  async saveProfile(userId: string, profileData: any) {
    try {
      const profileRef = ref(database, `profiles/${userId}`)
      await set(profileRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      })

      return { success: true }
    } catch (error) {
      console.error("Error saving profile:", error)
      throw error
    }
  },

  async getProfile(userId: string) {
    try {
      const profileRef = ref(database, `profiles/${userId}`)
      const snapshot = await get(profileRef)

      if (snapshot.exists()) {
        return snapshot.val()
      }
      return null
    } catch (error) {
      console.error("Error getting profile:", error)
      throw error
    }
  },

  // Real-time listeners
  subscribeToAnalytics(callback: (data: any) => void) {
    const analyticsRef = ref(database, "analytics")
    onValue(analyticsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    })

    return () => off(analyticsRef)
  },

  subscribeToContacts(userId: string, callback: (data: any) => void) {
    const contactsRef = ref(database, `contacts/${userId}`)
    onValue(contactsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      }
    })

    return () => off(contactsRef)
  },
}
