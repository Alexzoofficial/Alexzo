// Build-time environment constants for client-side use
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdemfbcvtqlowdiqefts.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZW1mYmN2dHFsb3dkaXFlZnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzc2NjMsImV4cCI6MjA3MTk1MzY2M30.SMH09TZo3qOMLQd0VmXTEK5GYCKX6YNrSUMUJAcNklY'

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)