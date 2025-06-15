import { type NextRequest, NextResponse } from "next/server"

export type UserRole = "ministry_admin" | "institution_admin" | "exam_body" | "student" | "examination_officer"

export interface User {
  user_id: string
  user_type: UserRole
  email: string
  first_name?: string
  last_name?: string
  institution_id?: string
  permissions?: string[]
  is_active: boolean
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  ministry_admin: [
    "manage_institutions",
    "manage_exams",
    "manage_users",
    "view_analytics",
    "publish_results",
    "system_admin",
  ],
  institution_admin: ["manage_students", "view_institution_data", "manage_registrations", "view_results"],
  exam_body: ["manage_exams", "upload_results", "view_registrations", "manage_exam_sessions"],
  student: ["register_for_exams", "view_own_results", "update_profile", "view_notifications"],
  examination_officer: ["verify_registrations", "manage_exam_sessions", "view_exam_data"],
} as const

// Route protection configuration
export const PROTECTED_ROUTES = {
  "/dashboard/ministry": ["ministry_admin"],
  "/dashboard/institution-admin": ["institution_admin"],
  "/dashboard/exam-body": ["exam_body"],
  "/dashboard/student": ["student"],
  "/dashboard/admin": ["ministry_admin"],
} as const

export function hasPermission(user: User, permission: string): boolean {
  const userPermissions = ROLE_PERMISSIONS[user.user_type] || []
  return userPermissions.includes(permission as any)
}

export function hasRole(user: User, role: UserRole): boolean {
  return user.user_type === role
}

export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.user_type)
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    // Make request to FastAPI backend to verify token
    const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return null
    }

    const userData = await response.json()
    return userData as User
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Try to get token from cookies
  const tokenCookie = request.cookies.get("auth_token")
  if (tokenCookie) {
    return tokenCookie.value
  }

  return null
}

export async function requireAuth(request: NextRequest): Promise<User | NextResponse> {
  const token = getTokenFromRequest(request)

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  const user = await verifyToken(token)

  if (!user || !user.is_active) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return user
}

export async function requireRole(request: NextRequest, allowedRoles: UserRole[]): Promise<User | NextResponse> {
  const userOrResponse = await requireAuth(request)

  if (userOrResponse instanceof NextResponse) {
    return userOrResponse
  }

  const user = userOrResponse as User

  if (!hasAnyRole(user, allowedRoles)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return user
}

export async function requirePermission(
  request: NextRequest,
  requiredPermission: string,
): Promise<User | NextResponse> {
  const userOrResponse = await requireAuth(request)

  if (userOrResponse instanceof NextResponse) {
    return userOrResponse
  }

  const user = userOrResponse as User

  if (!hasPermission(user, requiredPermission)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return user
}
