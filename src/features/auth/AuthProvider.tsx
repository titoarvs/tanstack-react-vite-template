import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { can, hasAnyRole, hasRole } from "./permissions"
import type { Permission } from "./permissions"
import { AuthContext } from "./authContextState"
import { RBAC_UPDATED_EVENT } from "./rbac/rbacStorage"
import { recordLogin, recordLogout } from "@/features/audit/auditLogger"
import { LogoutConfirmDialog } from "./components/LogoutConfirmDialog"
import {
  clearSession,
  getSession,
  mockLogin,
  setSession,
} from "./authStorage"
import type { AuthUser } from "./types"
import type { UserRole } from "./types"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getSession())
  const [rbacRevision, setRbacRevision] = useState(0)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const afterLogoutRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const handler = () => setRbacRevision(revision => revision + 1)
    window.addEventListener(RBAC_UPDATED_EVENT, handler)
    return () => window.removeEventListener(RBAC_UPDATED_EVENT, handler)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const session = mockLogin(email, password)
    if (!session) {
      return {
        ok: false as const,
        message: "Enter a valid email and password (min. 4 characters).",
      }
    }
    setSession(session)
    setUser(session)
    recordLogin(session)
    return { ok: true as const }
  }, [])

  const performLogout = useCallback(() => {
    const current = getSession()
    if (current) recordLogout(current)
    clearSession()
    setUser(null)
  }, [])

  const requestLogout = useCallback((afterLogout?: () => void) => {
    afterLogoutRef.current = afterLogout ?? null
    setLogoutOpen(true)
  }, [])

  const confirmLogout = useCallback(() => {
    performLogout()
    setLogoutOpen(false)
    const afterLogout = afterLogoutRef.current
    afterLogoutRef.current = null
    afterLogout?.()
  }, [performLogout])

  const handleLogoutOpenChange = useCallback((open: boolean) => {
    setLogoutOpen(open)
    if (!open) afterLogoutRef.current = null
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      requestLogout,
      role: user?.role ?? null,
      can: (permission: Permission) => can(user, permission),
      hasRole: (role: UserRole) => hasRole(user, role),
      hasAnyRole: (roles: readonly UserRole[]) => hasAnyRole(user, roles),
    }),
    [user, login, requestLogout, rbacRevision]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={handleLogoutOpenChange}
        onConfirm={confirmLogout}
      />
    </AuthContext.Provider>
  )
}
