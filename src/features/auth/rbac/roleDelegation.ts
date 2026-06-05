import { PERMISSIONS, type Permission } from "../permissionKeys"
import type { UserRole } from "../types"
import { PERMISSION_GROUPS, type PermissionGroup } from "./rbacCatalog"

const EDM_STANDARD: readonly Permission[] = [
  PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
  PERMISSIONS.EMPLOYEES_PROFILE_COMPENSATION,
  PERMISSIONS.EMPLOYEES_PROFILE_GOVERNMENT,
  PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
  PERMISSIONS.EMPLOYEES_PROFILE_COMPLIANCE,
  PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
]

const EDM_TEAM: readonly Permission[] = [
  PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
  PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
  PERMISSIONS.EMPLOYEES_PROFILE_ACCESS,
  PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
]

const EDM_HR: readonly Permission[] = [
  ...EDM_STANDARD,
  PERMISSIONS.EMPLOYEES_PROFILE_ACCESS,
  PERMISSIONS.EMPLOYEES_PROFILE_PAY,
  PERMISSIONS.EMPLOYEES_PROFILE_PERFORMANCE,
]

const EDM_IT: readonly Permission[] = [
  PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
  PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
  PERMISSIONS.EMPLOYEES_PROFILE_ACCESS,
  PERMISSIONS.EMPLOYEES_PROFILE_COMPLIANCE,
]

export interface RoleDelegationProfile {
  /** Plain-language scope shown in the RBAC UI */
  scope: string
  /** Permissions Super Admin may grant or revoke for this role */
  delegatable: readonly Permission[]
  /** Always effective — not shown as toggles */
  required: readonly Permission[]
}

export const ROLE_DELEGATION: Record<UserRole, RoleDelegationProfile> = {
  employee: {
    scope: "Self-service only — own employment record, personal documents, and requests.",
    required: [PERMISSIONS.EMPLOYEES_VIEW_OWN],
    delegatable: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SETTINGS_THEME,
      PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
      PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
      PERMISSIONS.EMPLOYEES_PROFILE_COMPENSATION,
      PERMISSIONS.EMPLOYEES_PROFILE_GOVERNMENT,
      PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
      PERMISSIONS.EMPLOYEES_PROFILE_COMPLIANCE,
      PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
      PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
    ],
  },
  manager: {
    scope: "Team leadership — directory access, direct-report profiles, and leave approvals.",
    required: [PERMISSIONS.EMPLOYEES_VIEW_OWN],
    delegatable: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SETTINGS_THEME,
      PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY,
      ...EDM_TEAM,
      PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
      PERMISSIONS.LEAVE_APPROVE,
    ],
  },
  hrbp: {
    scope: "Workforce partner — directory-wide read access to standard profile data.",
    required: [PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY],
    delegatable: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SETTINGS_THEME,
      ...EDM_STANDARD,
      PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
    ],
  },
  hris_admin: {
    scope: "HR operations — full employee lifecycle, sensitive HR data, and billing.",
    required: [PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY],
    delegatable: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_THEME,
      PERMISSIONS.EMPLOYEES_CREATE,
      PERMISSIONS.EMPLOYEES_DELETE,
      ...EDM_HR,
      PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
      PERMISSIONS.BILLING_MANAGE,
    ],
  },
  hris_super_admin: {
    scope: "Full HRIS control — all capabilities including users, RBAC, and audit.",
    required: [],
    delegatable: PERMISSION_GROUPS.flatMap(group =>
      group.permissions.map(permission => permission.key)
    ),
  },
  system_admin: {
    scope: "Platform IT — limited HR visibility, workspace settings, and audit trail.",
    required: [PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY],
    delegatable: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_THEME,
      ...EDM_IT,
      PERMISSIONS.AUDIT_VIEW,
    ],
  },
}

const delegatableByRole = new Map<UserRole, ReadonlySet<Permission>>(
  (Object.entries(ROLE_DELEGATION) as [UserRole, RoleDelegationProfile][]).map(
    ([role, profile]) => [role, new Set(profile.delegatable)]
  )
)

const requiredByRole = new Map<UserRole, ReadonlySet<Permission>>(
  (Object.entries(ROLE_DELEGATION) as [UserRole, RoleDelegationProfile][]).map(
    ([role, profile]) => [role, new Set(profile.required)]
  )
)

export function getRoleDelegationProfile(role: UserRole): RoleDelegationProfile {
  return ROLE_DELEGATION[role]
}

export function getDelegatablePermissionsForRole(role: UserRole): readonly Permission[] {
  return ROLE_DELEGATION[role].delegatable
}

export function getRequiredPermissionsForRole(role: UserRole): readonly Permission[] {
  return ROLE_DELEGATION[role].required
}

export function isDelegatablePermission(role: UserRole, permission: Permission): boolean {
  return delegatableByRole.get(role)?.has(permission) ?? false
}

export function isRequiredPermission(role: UserRole, permission: Permission): boolean {
  return requiredByRole.get(role)?.has(permission) ?? false
}

export function getPermissionGroupsForRole(role: UserRole): PermissionGroup[] {
  const delegatable = delegatableByRole.get(role)
  if (!delegatable) return []

  return PERMISSION_GROUPS.map(group => ({
    ...group,
    permissions: group.permissions.filter(permission => delegatable.has(permission.key)),
  })).filter(group => group.permissions.length > 0)
}

export function sanitizePermissionsForRole(
  role: UserRole,
  permissions: readonly Permission[]
): Permission[] {
  const delegatable = delegatableByRole.get(role)
  const required = requiredByRole.get(role)
  if (!delegatable || !required) return [...permissions]

  const allowed = permissions.filter(
    permission => delegatable.has(permission) || required.has(permission)
  )

  return [...new Set([...required, ...allowed])]
}

export function countEnabledDelegatable(
  role: UserRole,
  permissions: readonly Permission[]
): { enabled: number; total: number } {
  const delegatable = getDelegatablePermissionsForRole(role)
  const enabled = delegatable.filter(permission => permissions.includes(permission)).length
  return { enabled, total: delegatable.length }
}
