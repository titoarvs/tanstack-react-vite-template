import type { AuthUser } from "./types"
import type { UserRole } from "./types"

/** Capability keys — extend as new screens/actions are added */
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  /** Full company directory and any employee record (manager, HR, admin) */
  EMPLOYEES_VIEW_DIRECTORY: "employees.view_directory",
  /** Own employment record only (employee role) */
  EMPLOYEES_VIEW_OWN: "employees.view_own",
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_DELETE: "employees.delete",
  EMPLOYEES_PROFILE_PERSONAL: "employees.profile.personal",
  EMPLOYEES_PROFILE_JOB: "employees.profile.job",
  EMPLOYEES_PROFILE_TIME_OFF: "employees.profile.time_off",
  EMPLOYEES_PROFILE_PAY: "employees.profile.pay",
  EMPLOYEES_PROFILE_PERFORMANCE: "employees.profile.performance",
  EMPLOYEES_PROFILE_SELF_SERVICE: "employees.profile.self_service",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_THEME: "settings.theme",
  LEAVE_APPROVE: "leave.approve",
  USERS_MANAGE: "users.manage",
  BILLING_MANAGE: "billing.manage",
  AUDIT_VIEW: "audit.view",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const EMPLOYEE_PROFILE_VIEW: readonly Permission[] = [
  PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  PERMISSIONS.EMPLOYEES_PROFILE_JOB,
  PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
]

const HR_PROFILE_VIEW: readonly Permission[] = [
  ...EMPLOYEE_PROFILE_VIEW,
  PERMISSIONS.EMPLOYEES_PROFILE_PAY,
  PERMISSIONS.EMPLOYEES_PROFILE_PERFORMANCE,
]

const EMPLOYEE_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.EMPLOYEES_VIEW_OWN,
  ...EMPLOYEE_PROFILE_VIEW,
  PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
  PERMISSIONS.SETTINGS_THEME,
]

const MANAGER_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY,
  PERMISSIONS.EMPLOYEES_VIEW_OWN,
  ...EMPLOYEE_PROFILE_VIEW,
  PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
  PERMISSIONS.SETTINGS_THEME,
  PERMISSIONS.LEAVE_APPROVE,
]

const HR_ADMIN_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY,
  PERMISSIONS.EMPLOYEES_CREATE,
  PERMISSIONS.EMPLOYEES_DELETE,
  ...HR_PROFILE_VIEW,
  PERMISSIONS.SETTINGS_VIEW,
  PERMISSIONS.SETTINGS_THEME,
  PERMISSIONS.BILLING_MANAGE,
]

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  employee: EMPLOYEE_PERMISSIONS,
  manager: MANAGER_PERMISSIONS,
  hr_admin: HR_ADMIN_PERMISSIONS,
  admin: [...HR_ADMIN_PERMISSIONS, PERMISSIONS.USERS_MANAGE, PERMISSIONS.AUDIT_VIEW],
}

export function getPermissionsForRole(role: UserRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role]
}

export function can(user: AuthUser | null | undefined, permission: Permission): boolean {
  if (!user) return false
  return ROLE_PERMISSIONS[user.role].includes(permission)
}

export function canAny(
  user: AuthUser | null | undefined,
  permissions: readonly Permission[]
): boolean {
  return permissions.some(p => can(user, p))
}

export function hasRole(
  user: AuthUser | null | undefined,
  role: UserRole
): boolean {
  return user?.role === role
}

export function hasAnyRole(
  user: AuthUser | null | undefined,
  roles: readonly UserRole[]
): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/** Whether the user may open the employee directory list */
export function canViewEmployeeDirectory(user: AuthUser | null | undefined): boolean {
  return can(user, PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY)
}

/** Whether the user may open any employee area (directory or own profile) */
export function canAccessEmployeesModule(user: AuthUser | null | undefined): boolean {
  return canViewEmployeeDirectory(user) || can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN)
}
