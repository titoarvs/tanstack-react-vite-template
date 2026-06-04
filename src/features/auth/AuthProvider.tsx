import { useCallback, useMemo, useState, type ReactNode } from "react"
import { can, hasAnyRole, hasRole } from "./permissions"
import type { Permission } from "./permissions"
import { AuthContext } from "./authContextState"
import { recordLogin, recordLogout } from "@/features/audit/auditLogger"
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

  const logout = useCallback(() => {
    const current = getSession()
    if (current) recordLogout(current)
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
      role: user?.role ?? null,
      can: (permission: Permission) => can(user, permission),
      hasRole: (role: UserRole) => hasRole(user, role),
      hasAnyRole: (roles: readonly UserRole[]) => hasAnyRole(user, roles),
    }),
    [user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
