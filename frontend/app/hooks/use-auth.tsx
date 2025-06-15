"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import apiClient, { type User } from "@/lib/api-client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error: any) {
      console.error("Auth check failed:", error)
      setError(error.message)
      // Clear invalid token
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { user: userData, token } = await apiClient.login(email, password)
      setUser(userData)
      localStorage.setItem("auth_token", token)

      // Redirect based on user role
      const dashboardRoutes: Record<string, string> = {
        student: "/dashboard/student",
        institutional_admin: "/dashboard/institution-admin",
        ministry_admin: "/dashboard/ministry",
        examination_officer: "/dashboard/exam-body",
      }

      const route = dashboardRoutes[userData.user_type] || "/dashboard"
      router.push(route)
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("auth_token")
      setIsLoading(false)
      router.push("/auth")
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error: any) {
      if (error.message === "Could not validate credentials") {
        try {
          // Try to refresh token
          await apiClient.refreshToken()
          const userData = await apiClient.getCurrentUser()
          setUser(userData)
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          setError("Session expired. Please login again.")
          setUser(null)
          localStorage.removeItem("auth_token")
          router.push("/auth")
        }
      } else {
        console.error("Refresh user failed:", error)
        setError(error.message)
      }
    }
  }

  const hasRole = (role: string): boolean => {
    return user?.user_type === role
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.user_type) : false
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return user ? permissions.some((permission) => user.permissions?.includes(permission)) : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
