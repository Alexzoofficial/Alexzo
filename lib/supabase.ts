import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ucmhhbzfljskelobfgdm.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbWhoYnpmbGpza2Vsb2JmZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDcxOTAsImV4cCI6MjA2OTUyMzE5MH0.2FEhEcPy7TGTh_8DDohUpIrrrBgtc9iJWiEK5yutIhA"

// For client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For component usage
export const createSupabaseClient = () => createClientComponentClient()

// Database helper functions
export const dbHelpers = {
  // Profiles
  async createProfile(profile: any) {
    const { data, error } = await supabase.from("profiles").insert(profile).select().single()

    if (error) throw error
    return data
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Contacts
  async createContact(contact: any) {
    const { data, error } = await supabase.from("contacts").insert(contact).select().single()

    if (error) throw error
    return data
  },

  async getContacts(userId?: string) {
    let query = supabase.from("contacts").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Analytics
  async logAnalytics(event: any) {
    const { data, error } = await supabase
      .from("analytics")
      .insert({
        ...event,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAnalytics(limit = 100) {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Public data
  async setPublicData(key: string, value: any) {
    const { data, error } = await supabase
      .from("public_data")
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getPublicData(key?: string) {
    let query = supabase.from("public_data").select("*")

    if (key) {
      query = query.eq("key", key).single()
    }

    const { data, error } = await query

    if (error && error.code !== "PGRST116") throw error
    return data
  },
}

// Real-time subscriptions
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, callback)
    .subscribe()
}
