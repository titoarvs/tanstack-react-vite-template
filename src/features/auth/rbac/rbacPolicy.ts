import type { AuthUser } from "../types"
import type { UserRole } from "../types"
import { PERMISSIONS, type Permission } from "../permissionKeys"
import { getDefaultPermissionsForRole } from "../rolePermissionDefaults"
import {
  getDelegatablePermissionsForRole,
  getRequiredPermissionsForRole,
  isDelegatablePermission,
  isRequiredPermission,
  sanitizePermissionsForRole,
} from "./roleDelegation"
import {
  clearRbacOverrideForRole,
  getRbacOverrideForRole,
  hasRbacOverride,
  setRbacOverrideForRole,
} from "./rbacStorage"

const LOCKED_PERMISSIONS: Partial<Record<UserRole, readonly Permission[]>> = {
  hris_super_admin: [
    PERMISSIONS.RBAC_MANAGE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],
}

function uniquePermissions(permissions: readonly Permission[]): Permission[] {
  return [...new Set(permissions)]
}

function applyLockedPermissions(
  role: UserRole,
  permissions: readonly Permission[]
): Permission[] {
  const locked = LOCKED_PERMISSIONS[role] ?? []
  return uniquePermissions([...permissions, ...locked])
}

function mergeRolePermissions(
  role: UserRole,
  delegatableSelection: readonly Permission[]
): Permission[] {
  const required = getRequiredPermissionsForRole(role)
  const sanitizedSelection = delegatableSelection.filter(permission =>
    isDelegatablePermission(role, permission)
  )
  return applyLockedPermissions(
    role,
    sanitizePermissionsForRole(role, [...required, ...sanitizedSelection])
  )
}

function resolveStoredPermissions(role: UserRole): readonly Permission[] {
  const override = getRbacOverrideForRole(role)
  if (override) {
    return mergeRolePermissions(role, override)
  }

  return sanitizePermissionsForRole(role, getDefaultPermissionsForRole(role))
}

export function getEffectivePermissionsForRole(role: UserRole): readonly Permission[] {
  return resolveStoredPermissions(role)
}

/** Delegatable permissions currently enabled for editing in the RBAC UI */
export function getEditablePermissionsForRole(role: UserRole): Permission[] {
  const effective = resolveStoredPermissions(role)
  return getDelegatablePermissionsForRole(role).filter(permission =>
    effective.includes(permission)
  )
}

export function isPermissionLocked(role: UserRole, permission: Permission): boolean {
  if (isRequiredPermission(role, permission)) return true
  return LOCKED_PERMISSIONS[role]?.includes(permission) ?? false
}

export function saveRolePermissions(role: UserRole, permissions: Permission[]) {
  const normalized = mergeRolePermissions(role, permissions)
  setRbacOverrideForRole(role, normalized)
}

export function resetRolePermissions(role: UserRole) {
  clearRbacOverrideForRole(role)
}

export function roleHasCustomPermissions(role: UserRole): boolean {
  return hasRbacOverride(role)
}

export function canManageRbac(user: AuthUser | null | undefined): boolean {
  if (!user || user.role !== "hris_super_admin") return false
  return getEffectivePermissionsForRole(user.role).includes(PERMISSIONS.RBAC_MANAGE)
}

export {
  countEnabledDelegatable,
  getPermissionGroupsForRole,
  getRequiredPermissionsForRole,
  getRoleDelegationProfile,
} from "./roleDelegation"
