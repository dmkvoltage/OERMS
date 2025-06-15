import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Your Supabase project details
const supabaseUrl = "https://rhciftnyuwefkckphped.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error)
  return {
    error: error.message || "An unexpected error occurred",
    code: error.code || "UNKNOWN_ERROR",
  }
}
