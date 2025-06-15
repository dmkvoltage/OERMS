"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  endpoint: string,
  options?: {
    immediate?: boolean
    dependencies?: any[]
  },
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [endpoint])

  useEffect(() => {
    if (options?.immediate !== false) {
      execute()
    }
  }, options?.dependencies || [])

  return {
    ...state,
    execute,
    refetch: execute,
  }
}

export function useExams(filters?: {
  type?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchExams = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.getExams(filters)
      setExams(response.exams)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch exams")
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createExam = useCallback(
    async (examData: any) => {
      try {
        const response = await apiClient.createExam(examData)
        await fetchExams() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create exam")
        throw err
      }
    },
    [fetchExams],
  )

  const updateExam = useCallback(
    async (id: string, examData: any) => {
      try {
        const response = await apiClient.updateExam(id, examData)
        await fetchExams() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update exam")
        throw err
      }
    },
    [fetchExams],
  )

  const deleteExam = useCallback(
    async (id: string) => {
      try {
        const response = await apiClient.deleteExam(id)
        await fetchExams() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete exam")
        throw err
      }
    },
    [fetchExams],
  )

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  return {
    exams,
    loading,
    error,
    total,
    refetch: fetchExams,
    createExam,
    updateExam,
    deleteExam,
  }
}

export function useRegistrations(filters?: {
  examId?: string
  studentId?: string
  status?: string
  limit?: number
  offset?: number
}) {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.getRegistrations(filters)
      setRegistrations(response.registrations)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch registrations")
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createRegistration = useCallback(
    async (registrationData: any) => {
      try {
        const response = await apiClient.createRegistration(registrationData)
        await fetchRegistrations() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create registration")
        throw err
      }
    },
    [fetchRegistrations],
  )

  const approveRegistration = useCallback(
    async (id: string) => {
      try {
        const response = await apiClient.approveRegistration(id)
        await fetchRegistrations() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to approve registration")
        throw err
      }
    },
    [fetchRegistrations],
  )

  const rejectRegistration = useCallback(
    async (id: string, reason?: string) => {
      try {
        const response = await apiClient.rejectRegistration(id, reason)
        await fetchRegistrations() // Refresh the list
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject registration")
        throw err
      }
    },
    [fetchRegistrations],
  )

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  return {
    registrations,
    loading,
    error,
    total,
    refetch: fetchRegistrations,
    createRegistration,
    approveRegistration,
    rejectRegistration,
  }
}

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
      setUser(null)
    } catch (err) {
      console.error("Logout error:", err)
    }
  }, [])

  const getCurrentUser = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.getCurrentUser()
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get user")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      getCurrentUser()
    } else {
      setLoading(false)
    }
  }, [getCurrentUser])

  return {
    user,
    loading,
    error,
    login,
    logout,
    refetch: getCurrentUser,
    isAuthenticated: !!user,
  }
}

export function useDashboardAnalytics(role?: string, timeframe?: string) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.getDashboardAnalytics({ role, timeframe })
      setAnalytics(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
    } finally {
      setLoading(false)
    }
  }, [role, timeframe])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
