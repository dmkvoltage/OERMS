import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Admin client with service role key for server-side operations
const supabaseAdmin = createClient<Database>(
  "https://rhciftnyuwefkckphped.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Admin functions for user management
export const adminFunctions = {
  // Create a new user with custom profile
  async createUser(userData: {
    email: string
    password: string
    role: Database["public"]["Enums"]["user_role"]
    first_name: string
    last_name: string
    institution_id?: string
    phone?: string
  }) {
    try {
      // Create auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      })

      if (authError) throw authError

      // Create user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authUser.user.id,
          email: userData.email,
          password_hash: "", // Will be handled by auth
          role: userData.role,
          first_name: userData.first_name,
          last_name: userData.last_name,
          institution_id: userData.institution_id,
          phone: userData.phone,
          is_active: true,
          email_verified: true,
        })
        .select()
        .single()

      if (profileError) throw profileError

      return { user: authUser.user, profile }
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  // Update user role
  async updateUserRole(userId: string, role: Database["public"]["Enums"]["user_role"]) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deactivate user
  async deactivateUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user with full details
  async getUserWithDetails(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        institution:institutions(*),
        registrations:registrations(
          *,
          exam:exams(name, type, start_date)
        ),
        results:results(
          *,
          exam:exams(name, type)
        )
      `)
      .eq("id", userId)
      .single()

    if (error) throw error
    return data
  },
}

export default supabaseAdmin
