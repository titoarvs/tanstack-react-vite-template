import type { UserRole } from "./types"

export const USER_ROLES = [
  "system_admin",
  "hris_super_admin",
  "hris_admin",
  "hrbp",
  "manager",
  "employee",
] as const satisfies readonly UserRole[]

export const ROLE_LABELS: Record<UserRole, string> = {
  system_admin: "System Admin",
  hris_super_admin: "HRIS SuperAdmin",
  hris_admin: "HRIS Admin",
  hrbp: "HRBP",
  manager: "Manager",
  employee: "Employee",
}

/** Short descriptions for login / settings UI */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  system_admin: "IT operations and system access management (limited HR data)",
  hris_super_admin: "Full HRIS access including user and audit management",
  hris_admin: "Manage directory, onboarding, and employee records",
  hrbp: "View workforce data and support business partner workflows",
  manager: "View team and employee profiles within reporting line",
  employee: "View own employment record and self-service requests",
}

/**
 * Relative rank for comparing roles (higher = more privileged).
 * Used for display ordering only — not authorization.
 */
export const ROLE_RANK: Record<UserRole, number> = {
  employee: 0,
  manager: 1,
  hrbp: 2,
  hris_admin: 3,
  hris_super_admin: 4,
  system_admin: 5,
}

/** Roles with HR write access (create/delete employees) */
export const HR_WRITE_ROLES: readonly UserRole[] = [
  "hris_admin",
  "hris_super_admin",
]

/** Roles with directory-wide read access */
export const DIRECTORY_ROLES: readonly UserRole[] = [
  "hris_super_admin",
  "hris_admin",
  "hrbp",
  "manager",
  "system_admin",
]

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role]
}

/** All signed-in roles */
export const ALL_APP_ROLES = USER_ROLES

/** HR write roles (create/delete employees) */
export const HR_WRITE_ROLES_LIST: readonly UserRole[] = HR_WRITE_ROLES

/** HR and super-admin roles */
export const HR_STAFF_ROLES: readonly UserRole[] = ["hris_admin", "hris_super_admin"]

/** HR operations including HRBP */
export const HR_OPS_ROLES: readonly UserRole[] = [
  "hris_admin",
  "hris_super_admin",
  "hrbp",
]

/** Typical staff excluding system admin */
export const WORKSPACE_ROLES: readonly UserRole[] = [
  "employee",
  "manager",
  "hrbp",
  "hris_admin",
  "hris_super_admin",
]

/** Privileged admin roles */
export const PRIVILEGED_ADMIN_ROLES: readonly UserRole[] = [
  "hris_super_admin",
  "system_admin",
]
