"use client"

import React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { type UserRole, Permission } from "@/lib/auth-middleware"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PermissionButtonProps extends ButtonProps {
  roles?: UserRole[]
  permissions?: Permission[]
  requireAll?: boolean
  fallbackText?: string
  showTooltip?: boolean
}

export function PermissionButton({
  children,
  roles,
  permissions,
  requireAll = false,
  fallbackText = "You don't have permission to perform this action",
  showTooltip = true,
  disabled,
  ...props
}: PermissionButtonProps) {
  const { user, hasAnyRole, hasAnyPermission } = useAuth()

  const hasAccess = React.useMemo(() => {
    if (!user) return false

    // Check role requirements
    if (roles && !hasAnyRole(roles)) {
      return false
    }

    // Check permission requirements
    if (permissions) {
      const permissionStrings = permissions.map((p) => p.toString())
      if (requireAll) {
        return permissionStrings.every((permission) => user.permissions?.includes(permission))
      } else {
        return hasAnyPermission(permissionStrings)
      }
    }

    return true
  }, [user, roles, permissions, requireAll, hasAnyRole, hasAnyPermission])

  const button = (
    <Button {...props} disabled={disabled || !hasAccess}>
      {children}
    </Button>
  )

  if (!hasAccess && showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{fallbackText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

// Specific permission buttons for common actions
export function CreateButton(props: Omit<PermissionButtonProps, "permissions">) {
  return (
    <PermissionButton
      permissions={[Permission.MANAGE_INSTITUTIONS, Permission.MANAGE_EXAMS, Permission.REGISTER_STUDENTS]}
      {...props}
    />
  )
}

export function EditButton(props: Omit<PermissionButtonProps, "permissions">) {
  return (
    <PermissionButton
      permissions={[Permission.MANAGE_INSTITUTIONS, Permission.MANAGE_EXAMS, Permission.MANAGE_INSTITUTION_STUDENTS]}
      {...props}
    />
  )
}

export function DeleteButton(props: Omit<PermissionButtonProps, "permissions">) {
  return <PermissionButton permissions={[Permission.DELETE_INSTITUTIONS, Permission.MANAGE_USERS]} {...props} />
}

export function PublishButton(props: Omit<PermissionButtonProps, "permissions">) {
  return <PermissionButton permissions={[Permission.PUBLISH_RESULTS]} {...props} />
}

export function VerifyButton(props: Omit<PermissionButtonProps, "permissions">) {
  return <PermissionButton permissions={[Permission.VERIFY_INSTITUTIONS, Permission.VERIFY_REGISTRATIONS]} {...props} />
}
