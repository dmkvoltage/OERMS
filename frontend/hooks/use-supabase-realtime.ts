"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Tables = Database["public"]["Tables"]

export function useSupabaseRealtime<T extends keyof Tables>(table: T, filter?: { column: string; value: any }) {
  const [data, setData] = useState<Tables[T]["Row"][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select("*")

        if (filter) {
          query = query.eq(filter.column, filter.value)
        }

        const { data: initialData, error: fetchError } = await query

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setData(initialData || [])
        }
      } catch (err) {
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((current) => [...current, payload.new as Tables[T]["Row"]])
          } else if (payload.eventType === "UPDATE") {
            setData((current) =>
              current.map((item) =>
                (item as any).id === (payload.new as any).id ? (payload.new as Tables[T]["Row"]) : item,
              ),
            )
          } else if (payload.eventType === "DELETE") {
            setData((current) => current.filter((item) => (item as any).id !== (payload.old as any).id))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filter?.column, filter?.value])

  return { data, loading, error }
}

// Specialized hooks for common use cases
export function useExamsRealtime(status?: string) {
  return useSupabaseRealtime("exams", status ? { column: "status", value: status } : undefined)
}

export function useRegistrationsRealtime(studentId?: string) {
  return useSupabaseRealtime("registrations", studentId ? { column: "student_id", value: studentId } : undefined)
}

export function useNotificationsRealtime(userId: string) {
  return useSupabaseRealtime("notifications", { column: "user_id", value: userId })
}

export function useResultsRealtime(studentId?: string) {
  return useSupabaseRealtime("results", studentId ? { column: "student_id", value: studentId } : undefined)
}
