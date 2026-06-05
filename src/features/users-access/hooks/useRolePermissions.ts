import { useCallback, useEffect, useMemo, useState } from "react"
import type { Permission } from "@/features/auth/permissions"
import type { UserRole } from "@/features/auth/types"
import {
  getEditablePermissionsForRole,
  resetRolePermissions,
  roleHasCustomPermissions,
  saveRolePermissions,
} from "@/features/auth/rbac/rbacPolicy"
import { RBAC_UPDATED_EVENT } from "@/features/auth/rbac/rbacStorage"

export function useRolePermissions(role: UserRole) {
  const [permissions, setPermissions] = useState<Permission[]>(() =>
    [...getEditablePermissionsForRole(role)]
  )
  const [isCustom, setIsCustom] = useState(() => roleHasCustomPermissions(role))

  const syncFromStorage = useCallback(() => {
    setPermissions([...getEditablePermissionsForRole(role)])
    setIsCustom(roleHasCustomPermissions(role))
  }, [role])

  useEffect(() => {
    syncFromStorage()
  }, [syncFromStorage])

  useEffect(() => {
    const handler = () => syncFromStorage()
    window.addEventListener(RBAC_UPDATED_EVENT, handler)
    return () => window.removeEventListener(RBAC_UPDATED_EVENT, handler)
  }, [syncFromStorage])

  const togglePermission = useCallback((permission: Permission, enabled: boolean) => {
    setPermissions(current => {
      if (enabled) {
        return current.includes(permission) ? current : [...current, permission]
      }
      return current.filter(item => item !== permission)
    })
  }, [])

  const save = useCallback(() => {
    saveRolePermissions(role, permissions)
    setIsCustom(roleHasCustomPermissions(role))
  }, [permissions, role])

  const reset = useCallback(() => {
    resetRolePermissions(role)
    syncFromStorage()
  }, [role, syncFromStorage])

  const isDirty = useMemo(() => {
    const stored = [...getEditablePermissionsForRole(role)].sort()
    const draft = [...permissions].sort()
    if (stored.length !== draft.length) return true
    return stored.some((permission, index) => permission !== draft[index])
  }, [permissions, role])

  return {
    permissions,
    isCustom,
    isDirty,
    togglePermission,
    save,
    reset,
  }
}
