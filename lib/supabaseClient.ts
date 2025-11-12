import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key for admin operations)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types
export interface Doc {
  id: string
  title: string
  slug: string
  file_path: string
  created_at: string
  updated_at: string
}
