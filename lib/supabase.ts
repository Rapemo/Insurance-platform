import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper function to get user role from metadata
export const getUserRole = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.user_metadata?.role || "user"
}

// Check if user has required role
export const hasRole = async (requiredRole: "user" | "underwriter" | "admin") => {
  const userRole = await getUserRole()

  // Admin has access to everything
  if (userRole === "admin") return true

  // Underwriter has access to underwriter and user routes
  if (userRole === "underwriter" && (requiredRole === "underwriter" || requiredRole === "user")) return true

  // User only has access to user routes
  if (userRole === "user" && requiredRole === "user") return true

  return false
}

