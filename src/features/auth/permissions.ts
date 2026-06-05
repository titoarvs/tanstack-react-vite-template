import type { AuthUser } from "./types"
import type { UserRole } from "./types"
import { PERMISSIONS, type Permission } from "./permissionKeys"
import { getEffectivePermissionsForRole } from "./rbac/rbacPolicy"
import { getDefaultPermissionsForRole } from "./rolePermissionDefaults"

export { PERMISSIONS, type Permission } from "./permissionKeys"

export function getPermissionsForRole(role: UserRole): readonly Permission[] {
  return getEffectivePermissionsForRole(role)
}

export function getDefaultRolePermissions(role: UserRole): readonly Permission[] {
  return getDefaultPermissionsForRole(role)
}

export function can(user: AuthUser | null | undefined, permission: Permission): boolean {
  if (!user) return false
  return getEffectivePermissionsForRole(user.role).includes(permission)
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

export function canViewEmployeeDirectory(user: AuthUser | null | undefined): boolean {
  return can(user, PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY)
}

export function canAccessEmployeesModule(user: AuthUser | null | undefined): boolean {
  return canViewEmployeeDirectory(user) || can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN)
}

export function isHrWriteRole(role: UserRole): boolean {
  return role === "hris_admin" || role === "hris_super_admin"
}
