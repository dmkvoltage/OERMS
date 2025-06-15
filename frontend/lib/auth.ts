import type { User } from "./types"
import { getUserByEmail } from "./data"

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // In a real application, this would verify against a database and use proper password hashing
  const user = getUserByEmail(email)

  if (user && user.password === password) {
    // Remove password from returned user object for security
    const { password: _, ...safeUser } = user
    return safeUser as User
  }

  return null
}

export function getUserRole(user: User): string {
  return user.role
}

export function isMinistryAdmin(user: User): boolean {
  return user.role === "ministry_admin"
}

export function isInstitutionAdmin(user: User): boolean {
  return user.role === "institution_admin"
}

export function isStudent(user: User): boolean {
  return user.role === "student"
}

export function isExamBody(user: User): boolean {
  return user.role === "exam_body"
}

export function canManageInstitutions(user: User): boolean {
  return isMinistryAdmin(user)
}

export function canManageExams(user: User): boolean {
  return isMinistryAdmin(user) || isExamBody(user)
}

export function canViewResults(user: User): boolean {
  return true // All users can view results, but what they see will be filtered
}

export function canApproveResults(user: User): boolean {
  return isMinistryAdmin(user)
}

export function canUploadResults(user: User): boolean {
  return isExamBody(user)
}

export function canRegisterForExam(user: User): boolean {
  return isStudent(user)
}

export function canManageStudentCredentials(user: User): boolean {
  return isInstitutionAdmin(user)
}

export function canManageSchoolData(user: User): boolean {
  return isInstitutionAdmin(user)
}

export function canViewSystemAnalytics(user: User): boolean {
  return isMinistryAdmin(user)
}
