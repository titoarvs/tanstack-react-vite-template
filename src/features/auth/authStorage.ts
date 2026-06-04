import { isUserRole } from "./roles"
import { getProvisionedUser } from "./provisionedUserStorage"
import { findDemoAccount, mockAdHocUser } from "./mockUsers"
import type { AuthUser } from "./types"

const STORAGE_KEY = "titohris-auth-session"

export { DEMO_CREDENTIALS } from "./mockUsers"

const LEGACY_ROLE_MAP: Record<string, AuthUser["role"]> = {
  "people development": "admin",
  administrator: "admin",
  admin: "admin",
  "hr admin": "hr_admin",
  "team member": "employee",
  employee: "employee",
  manager: "manager",
}

function parseRole(value: unknown): AuthUser["role"] | null {
  if (isUserRole(value)) return value
  if (typeof value === "string") {
    const mapped = LEGACY_ROLE_MAP[value.trim().toLowerCase()]
    if (mapped) return mapped
  }
  return null
}

function normalizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null
  const record = raw as Record<string, unknown>
  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : ""
  const name = typeof record.name === "string" ? record.name : ""
  const role = parseRole(record.role)
  if (!email || !name || !role) return null

  const id =
    typeof record.id === "string" && record.id.length > 0
      ? record.id
      : `user-legacy-${email}`

  const employeeId =
    typeof record.employeeId === "string" && record.employeeId.length > 0
      ? record.employeeId
      : undefined

  const organizationId =
    typeof record.organizationId === "string" && record.organizationId.length > 0
      ? record.organizationId
      : undefined

  const organizationName =
    typeof record.organizationName === "string" && record.organizationName.length > 0
      ? record.organizationName
      : undefined

  return { id, email, name, role, employeeId, organizationId, organizationName }
}

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizeUser(JSON.parse(raw))
  } catch {
    return null
  }
}

export function setSession(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated() {
  return getSession() !== null
}

export function mockLogin(email: string, password: string): AuthUser | null {
  const demo = findDemoAccount(email, password)
  if (demo) return demo

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || password.length < 4) return null

  const provisioned = getProvisionedUser(normalizedEmail)
  if (provisioned) {
    return {
      id: `user-prov-${provisioned.email}`,
      email: provisioned.email,
      name: provisioned.name,
      role: "employee",
      employeeId: provisioned.employeeId,
      organizationId: provisioned.organizationId,
      organizationName: provisioned.organizationName,
    }
  }

  return mockAdHocUser(normalizedEmail)
}
