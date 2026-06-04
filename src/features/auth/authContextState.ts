import { createContext } from "react"
import type { Permission } from "./permissions"
import type { AuthUser } from "./types"
import type { UserRole } from "./types"

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  logout: () => void
  /** Current role, if signed in */
  role: UserRole | null
  can: (permission: Permission) => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: readonly UserRole[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
