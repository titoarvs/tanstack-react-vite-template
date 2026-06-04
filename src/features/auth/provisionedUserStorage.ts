export interface ProvisionedPortalUser {
  email: string
  employeeId: string
  name: string
  organizationId?: string
  organizationName?: string
  provisionedAt: string
}

const STORAGE_KEY = "titohris-provisioned-users"

type ProvisionedMap = Record<string, ProvisionedPortalUser>

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function readMap(): ProvisionedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as ProvisionedMap
  } catch {
    return {}
  }
}

function writeMap(map: ProvisionedMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function provisionPortalUser(input: {
  email: string
  employeeId: string
  name: string
  organizationId?: string
  organizationName?: string
}): ProvisionedPortalUser {
  const map = readMap()
  const email = normalizeEmail(input.email)
  const record: ProvisionedPortalUser = {
    email,
    employeeId: input.employeeId,
    name: input.name,
    organizationId: input.organizationId,
    organizationName: input.organizationName,
    provisionedAt: new Date().toISOString(),
  }
  map[email] = record
  writeMap(map)
  return record
}

export function getProvisionedUser(email: string): ProvisionedPortalUser | undefined {
  return readMap()[normalizeEmail(email)]
}
