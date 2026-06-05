import type { Permission } from "../permissionKeys"
import type { UserRole } from "../types"

const STORAGE_KEY = "titohris_rbac_overrides"

export const RBAC_UPDATED_EVENT = "titohris:rbac-updated"

export type RbacOverrides = Partial<Record<UserRole, Permission[]>>

function readOverrides(): RbacOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as RbacOverrides
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(overrides: RbacOverrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  window.dispatchEvent(new CustomEvent(RBAC_UPDATED_EVENT))
}

export function getRbacOverrides(): RbacOverrides {
  return readOverrides()
}

export function getRbacOverrideForRole(role: UserRole): Permission[] | undefined {
  return readOverrides()[role]
}

export function setRbacOverrideForRole(role: UserRole, permissions: Permission[]) {
  const overrides = readOverrides()
  overrides[role] = permissions
  writeOverrides(overrides)
}

export function clearRbacOverrideForRole(role: UserRole) {
  const overrides = readOverrides()
  delete overrides[role]
  writeOverrides(overrides)
}

export function hasRbacOverride(role: UserRole): boolean {
  return getRbacOverrideForRole(role) != null
}
