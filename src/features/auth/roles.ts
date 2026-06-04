import type { UserRole } from "./types"

export const USER_ROLES = ["employee", "manager", "hr_admin", "admin"] as const satisfies readonly UserRole[]

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr_admin: "HR Admin",
  admin: "Administrator",
}

/** Short descriptions for login / settings UI */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  employee: "View own employment record and self-service requests (preview)",
  manager: "View team and employee profiles",
  hr_admin: "Manage directory, onboarding, and employee records",
  admin: "Full access including future user management",
}

/**
 * Relative rank for comparing roles (higher = more privileged).
 * Used for display ordering only — not authorization.
 */
export const ROLE_RANK: Record<UserRole, number> = {
  employee: 0,
  manager: 1,
  hr_admin: 2,
  admin: 3,
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role]
}
