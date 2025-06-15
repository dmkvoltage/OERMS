"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        if (session?.user) {
          // Fetch user details from our users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select(`
              *,
              institution:institutions(*)
            `)
            .eq("id", session.user.id)
            .single()

          if (userError) {
            setError(userError.message)
          } else {
            setUser(userData)
          }
        }
      } catch (err) {
        setError("Failed to get session")
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select(`
              *,
              institution:institutions(*)
            `)
          .eq("id", session.user.id)
          .single()

        if (!userError) {
          setUser(userData)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return { success: false, error: signInError.message }
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = "Failed to sign in"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setUser(null)
      return { success: true }
    } catch (err) {
      const errorMessage = "Failed to sign out"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
