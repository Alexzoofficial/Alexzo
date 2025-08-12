import { database, analytics } from "./firebase"
import { ref, set, get, push, onValue, off } from "firebase/database"
import { logEvent } from "firebase/analytics"

export const firebaseHelpers = {
  // Profile operations
  async saveProfile(userId: string, data: any) {
    if (!database) {
      console.warn("Database not initialized")
      return
    }

    try {
      const profileRef = ref(database, `profiles/${userId}`)
      await set(profileRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      throw error
    }
  },

  async getProfile(userId: string) {
    if (!database) {
      console.warn("Database not initialized")
      return null
    }

    try {
      const profileRef = ref(database, `profiles/${userId}`)
      const snapshot = await get(profileRef)
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error("Error getting profile:", error)
      return null
    }
  },

  // Contact operations
  async saveContact(userId: string, contactData: any) {
    if (!database) {
      console.warn("Database not initialized")
      return
    }

    try {
      const contactRef = ref(database, `contacts/${userId}`)
      const newContactRef = push(contactRef)
      await set(newContactRef, {
        ...contactData,
        timestamp: new Date().toISOString(),
      })
      return newContactRef.key
    } catch (error) {
      console.error("Error saving contact:", error)
      throw error
    }
  },

  // Public data operations
  async savePublicData(path: string, data: any) {
    if (!database) {
      console.warn("Database not initialized")
      return
    }

    try {
      const publicRef = ref(database, `public/${path}`)
      await set(publicRef, {
        ...data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving public data:", error)
      throw error
    }
  },

  async getPublicData(path: string) {
    if (!database) {
      console.warn("Database not initialized")
      return null
    }

    try {
      const publicRef = ref(database, `public/${path}`)
      const snapshot = await get(publicRef)
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error("Error getting public data:", error)
      return null
    }
  },

  // Analytics operations
  async logAnalytics(eventData: any) {
    if (!database) {
      console.warn("Database not initialized")
      return
    }

    try {
      const analyticsRef = ref(database, "analytics")
      const newAnalyticsRef = push(analyticsRef)
      await set(newAnalyticsRef, {
        ...eventData,
        timestamp: new Date().toISOString(),
      })

      // Also log to Firebase Analytics if available
      if (analytics && eventData.event) {
        logEvent(analytics, eventData.event, {
          custom_parameter: eventData.userId || "anonymous",
        })
      }
    } catch (error) {
      console.error("Error logging analytics:", error)
    }
  },

  // Newsletter operations
  async saveNewsletterSubscription(email: string, additionalData: any = {}) {
    if (!database) {
      console.warn("Database not initialized")
      return
    }

    try {
      const newsletterRef = ref(database, "public/newsletter")
      const newSubscriptionRef = push(newsletterRef)
      await set(newSubscriptionRef, {
        email,
        ...additionalData,
        subscribedAt: new Date().toISOString(),
        status: "active",
      })
      return newSubscriptionRef.key
    } catch (error) {
      console.error("Error saving newsletter subscription:", error)
      throw error
    }
  },

  // Real-time listeners
  subscribeToAnalytics(callback: (data: any) => void) {
    if (!database) {
      console.warn("Database not initialized")
      return () => {}
    }

    try {
      const analyticsRef = ref(database, "analytics")
      onValue(analyticsRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val())
        }
      })

      return () => off(analyticsRef)
    } catch (error) {
      console.error("Error subscribing to analytics:", error)
      return () => {}
    }
  },

  subscribeToContacts(userId: string, callback: (data: any) => void) {
    if (!database) {
      console.warn("Database not initialized")
      return () => {}
    }

    try {
      const contactsRef = ref(database, `contacts/${userId}`)
      onValue(contactsRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val())
        }
      })

      return () => off(contactsRef)
    } catch (error) {
      console.error("Error subscribing to contacts:", error)
      return () => {}
    }
  },
}
