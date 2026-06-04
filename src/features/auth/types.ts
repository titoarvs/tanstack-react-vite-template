/**
 * Application user roles. Extend this union when adding new role types.
 */
export type UserRole = "employee" | "manager" | "hr_admin" | "admin"

/**
 * Signed-in application user (distinct from HR `Employee` records).
 * `employeeId` links a user to a directory profile when applicable.
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  employeeId?: string
  /** SaaS tenant — defaults from email domain in mock auth */
  organizationId?: string
  organizationName?: string
}

/** @deprecated Use AuthUser — kept as alias for gradual migration */
export type AuthSession = AuthUser
