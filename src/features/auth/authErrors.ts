import { getSession } from "./authStorage"
import { can, type Permission } from "./permissions"
import type { AuthUser } from "./types"

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message)
    this.name = "ForbiddenError"
  }
}

export function requireSessionUser(): AuthUser {
  const user = getSession()
  if (!user) throw new ForbiddenError("Sign in required.")
  return user
}

export function requireSessionPermission(permission: Permission): AuthUser {
  const user = requireSessionUser()
  if (!can(user, permission)) throw new ForbiddenError()
  return user
}
