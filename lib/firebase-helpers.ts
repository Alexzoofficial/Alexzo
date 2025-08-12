import { ref, set, get, push, onValue, serverTimestamp as rtdbServerTimestamp } from "firebase/database"
import { database } from "./firebase"

export const firebaseHelpers = {
  // Profiles
  async createProfile(userId: string, profileData: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return profileData
      }

      const profileRef = ref(database, `profiles/${userId}`)
      await set(profileRef, {
        ...profileData,
        createdAt: rtdbServerTimestamp(),
        updatedAt: rtdbServerTimestamp(),
      })
      return profileData
    } catch (error) {
      console.error("Error creating profile:", error)
      throw error
    }
  },

  async getProfile(userId: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return null
      }

      const profileRef = ref(database, `profiles/${userId}`)
      const snapshot = await get(profileRef)

      if (snapshot.exists()) {
        return { id: userId, ...snapshot.val() }
      }
      return null
    } catch (error) {
      console.error("Error getting profile:", error)
      return null
    }
  },

  async updateProfile(userId: string, updates: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return updates
      }

      const profileRef = ref(database, `profiles/${userId}`)
      const currentData = await get(profileRef)

      await set(profileRef, {
        ...(currentData.exists() ? currentData.val() : {}),
        ...updates,
        updatedAt: rtdbServerTimestamp(),
      })
      return updates
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  // Contacts
  async createContact(contactData: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return { id: `demo-${Date.now()}`, ...contactData }
      }

      const contactsRef = ref(database, "contacts")
      const newContactRef = push(contactsRef)

      await set(newContactRef, {
        ...contactData,
        createdAt: rtdbServerTimestamp(),
        updatedAt: rtdbServerTimestamp(),
      })

      return { id: newContactRef.key, ...contactData }
    } catch (error) {
      console.error("Error creating contact:", error)
      throw error
    }
  },

  async getContacts(userId?: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return []
      }

      const contactsRef = ref(database, "contacts")
      const snapshot = await get(contactsRef)

      if (!snapshot.exists()) {
        return []
      }

      const contacts = []
      snapshot.forEach((childSnapshot) => {
        const contact = childSnapshot.val()
        if (!userId || contact.userId === userId) {
          contacts.push({
            id: childSnapshot.key,
            ...contact,
          })
        }
      })

      return contacts.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error("Error getting contacts:", error)
      return []
    }
  },

  async updateContact(contactId: string, updates: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return updates
      }

      const contactRef = ref(database, `contacts/${contactId}`)
      const currentData = await get(contactRef)

      await set(contactRef, {
        ...(currentData.exists() ? currentData.val() : {}),
        ...updates,
        updatedAt: rtdbServerTimestamp(),
      })
      return updates
    } catch (error) {
      console.error("Error updating contact:", error)
      throw error
    }
  },

  async deleteContact(contactId: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return true
      }

      const contactRef = ref(database, `contacts/${contactId}`)
      await set(contactRef, null)
      return true
    } catch (error) {
      console.error("Error deleting contact:", error)
      throw error
    }
  },

  // Analytics
  async logAnalytics(eventData: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return null
      }

      const analyticsRef = ref(database, "analytics")
      const newAnalyticsRef = push(analyticsRef)

      await set(newAnalyticsRef, {
        ...eventData,
        createdAt: rtdbServerTimestamp(),
      })

      return { id: newAnalyticsRef.key, ...eventData }
    } catch (error) {
      console.error("Error logging analytics:", error)
      return null
    }
  },

  async getAnalytics(limitCount = 100) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return []
      }

      const analyticsRef = ref(database, "analytics")
      const snapshot = await get(analyticsRef)

      if (!snapshot.exists()) {
        return []
      }

      const analytics = []
      snapshot.forEach((childSnapshot) => {
        analytics.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        })
      })

      return analytics
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
          const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
          return bTime - aTime
        })
        .slice(0, limitCount)
    } catch (error) {
      console.error("Error getting analytics:", error)
      return []
    }
  },

  // Public data
  async setPublicData(key: string, value: any) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return { key, value, updatedAt: new Date().toISOString() }
      }

      const publicDataRef = ref(database, `public/${key}`)
      const data = {
        key,
        value,
        updatedAt: rtdbServerTimestamp(),
      }
      await set(publicDataRef, data)
      return data
    } catch (error) {
      console.error("Error setting public data:", error)
      throw error
    }
  },

  async getPublicData(key?: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return key ? null : []
      }

      if (key) {
        const publicDataRef = ref(database, `public/${key}`)
        const snapshot = await get(publicDataRef)

        if (snapshot.exists()) {
          return { id: key, ...snapshot.val() }
        }
        return null
      } else {
        const publicDataRef = ref(database, "public")
        const snapshot = await get(publicDataRef)

        if (!snapshot.exists()) {
          return []
        }

        const data = []
        snapshot.forEach((childSnapshot) => {
          data.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          })
        })
        return data
      }
    } catch (error) {
      console.error("Error getting public data:", error)
      return key ? null : []
    }
  },

  // Real-time subscriptions
  subscribeToContacts(callback: (contacts: any[]) => void, userId?: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return () => {}
      }

      const contactsRef = ref(database, "contacts")

      const unsubscribe = onValue(contactsRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const contacts = []
        snapshot.forEach((childSnapshot) => {
          const contact = childSnapshot.val()
          if (!userId || contact.userId === userId) {
            contacts.push({
              id: childSnapshot.key,
              ...contact,
            })
          }
        })

        const sortedContacts = contacts.sort((a, b) => {
          const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
          const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
          return bTime - aTime
        })

        callback(sortedContacts)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error subscribing to contacts:", error)
      return () => {}
    }
  },

  subscribeToAnalytics(callback: (analytics: any[]) => void, limitCount = 100) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return () => {}
      }

      const analyticsRef = ref(database, "analytics")

      const unsubscribe = onValue(analyticsRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const analytics = []
        snapshot.forEach((childSnapshot) => {
          analytics.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          })
        })

        const sortedAnalytics = analytics
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
            const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
            return bTime - aTime
          })
          .slice(0, limitCount)

        callback(sortedAnalytics)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error subscribing to analytics:", error)
      return () => {}
    }
  },

  subscribeToPublicData(callback: (data: any[]) => void) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return () => {}
      }

      const publicDataRef = ref(database, "public")

      const unsubscribe = onValue(publicDataRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback([])
          return
        }

        const data = []
        snapshot.forEach((childSnapshot) => {
          data.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          })
        })

        callback(data)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error subscribing to public data:", error)
      return () => {}
    }
  },

  // Admin functions
  async isAdmin(userId: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return false
      }

      const adminRef = ref(database, `admins/${userId}`)
      const snapshot = await get(adminRef)
      return snapshot.exists()
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  },

  async makeAdmin(userId: string) {
    try {
      if (!database) {
        console.warn("Database not initialized")
        return true
      }

      const adminRef = ref(database, `admins/${userId}`)
      await set(adminRef, {
        userId,
        createdAt: rtdbServerTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error making admin:", error)
      throw error
    }
  },
}
