"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

interface RoleGuardProps {
  children: React.ReactNode
  roles?: string[]
  permissions?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
  redirectTo?: string
}

export function RoleGuard({ children, roles, permissions, requireAll = false, fallback, redirectTo }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated, hasAnyRole, hasAnyPermission, hasPermission } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          You must be logged in to access this content.
          <Link href="/auth" className="ml-2 underline">
            Login here
          </Link>
        </AlertDescription>
      </Alert>
    )
  }

  // Check role requirements
  if (roles && !hasAnyRole(roles)) {
    if (fallback) return <>{fallback}</>

    return (
      <Alert className="border-orange-200 bg-orange-50">
        <Shield className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          You don't have the required role to access this content.
          {redirectTo && (
            <Link href={redirectTo} className="ml-2">
              <Button variant="outline" size="sm">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  // Check permission requirements
  if (permissions) {
    const hasRequiredPermissions = requireAll
      ? permissions.every((permission) => hasPermission(permission))
      : hasAnyPermission(permissions)

    if (!hasRequiredPermissions) {
      if (fallback) return <>{fallback}</>

      return (
        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You don't have the required permissions to access this content.
            {redirectTo && (
              <Link href={redirectTo} className="ml-2">
                <Button variant="outline" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )
    }
  }

  return <>{children}</>
}

// Convenience components for specific roles
export function StudentGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roles={["student"]} fallback={fallback} redirectTo="/dashboard/student">
      {children}
    </RoleGuard>
  )
}

export function InstitutionalAdminGuard({
  children,
  fallback,
}: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roles={["institutional_admin"]} fallback={fallback} redirectTo="/dashboard/institution-admin">
      {children}
    </RoleGuard>
  )
}

export function MinistryAdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roles={["ministry_admin"]} fallback={fallback} redirectTo="/dashboard/ministry">
      {children}
    </RoleGuard>
  )
}

export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard roles={["ministry_admin", "institutional_admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
