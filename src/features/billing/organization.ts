import type { AuthUser } from "@/features/auth/types"

const DEFAULT_ORG_ID = "org-titohris"
const DEFAULT_ORG_NAME = "TitoHRIS Demo Co."

export function resolveOrganizationId(user: AuthUser): string {
  if (user.organizationId) return user.organizationId
  const domain = user.email.split("@")[1]
  if (!domain || domain === "titohris.com") return DEFAULT_ORG_ID
  return `org-${domain.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`
}

export function resolveOrganizationName(user: AuthUser): string {
  if (user.organizationName) return user.organizationName
  const domain = user.email.split("@")[1]
  if (!domain || domain === "titohris.com") return DEFAULT_ORG_NAME
  const label = domain.split(".")[0] ?? domain
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} Workspace`
}

export function isDemoOrganization(organizationId: string): boolean {
  return organizationId === DEFAULT_ORG_ID
}
