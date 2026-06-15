import { getSession } from "@/features/auth/authStorage"
import type { AuthUser } from "@/features/auth/types"
import { resolveOrganizationId } from "@/features/billing/organization"
import { appendAuditEntry } from "./auditStorage"
import { getPathTitle } from "./pathTitles"
import type { AuditAction, AuditCategory, AuditLogEntry } from "./types"

let lastNavigation: { pathname: string; at: number } | null = null

function createId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function baseEntry(
  user: AuthUser,
  category: AuditCategory,
  action: AuditAction,
  summary: string,
  extra?: Partial<Pick<AuditLogEntry, "pathname" | "metadata">>
): AuditLogEntry {
  return {
    id: createId(),
    timestamp: new Date().toISOString(),
    organizationId: resolveOrganizationId(user),
    actorId: user.id,
    actorEmail: user.email,
    actorName: user.name,
    actorRole: user.role,
    category,
    action,
    summary,
    ...extra,
  }
}

export function recordAudit(
  partial: {
    category: AuditCategory
    action: AuditAction
    summary: string
    pathname?: string
    metadata?: Record<string, string>
  },
  user?: AuthUser | null
) {
  const actor = user ?? getSession()
  if (!actor) return

  const entry = baseEntry(
    actor,
    partial.category,
    partial.action,
    partial.summary,
    { pathname: partial.pathname, metadata: partial.metadata }
  )
  appendAuditEntry(entry.organizationId, entry)
}

export function recordPageView(pathname: string, user?: AuthUser | null) {
  const actor = user ?? getSession()
  if (!actor) return
  if (pathname === "/login" || pathname === "/" || pathname === "/pricing") return

  const now = Date.now()
  if (
    lastNavigation?.pathname === pathname &&
    now - lastNavigation.at < 1500
  ) {
    return
  }
  lastNavigation = { pathname, at: now }

  const title = getPathTitle(pathname)
  recordAudit(
    {
      category: "navigation",
      action: "page.view",
      summary: `Viewed ${title}`,
      pathname,
      metadata: { screen: title },
    },
    actor
  )
}

export function recordLogin(user: AuthUser) {
  recordAudit(
    {
      category: "auth",
      action: "auth.login",
      summary: `${user.name} signed in`,
      metadata: { role: user.role },
    },
    user
  )
}

export function recordLogout(user: AuthUser) {
  recordAudit(
    {
      category: "auth",
      action: "auth.logout",
      summary: `${user.name} signed out`,
    },
    user
  )
}

export function recordEmployeeCreated(employeeId: string, displayName: string) {
  recordAudit({
    category: "employee",
    action: "employee.created",
    summary: `Created employee ${displayName}`,
    pathname: "/employees/onboarding",
    metadata: { employeeId, name: displayName },
  })
}

export function recordEmployeeDeleted(employeeId: string, displayName: string) {
  recordAudit({
    category: "employee",
    action: "employee.deleted",
    summary: `Removed employee ${displayName}`,
    metadata: { employeeId, name: displayName },
  })
}

export function recordEmployeeViewed(employeeId: string, displayName: string) {
  const actor = getSession()
  if (!actor) return
  recordAudit({
    category: "employee",
    action: "employee.viewed",
    summary: `Opened profile for ${displayName}`,
    pathname: `/employees/${employeeId}`,
    metadata: { employeeId, name: displayName },
  })
}

export function recordBillingSubscribed(planId: string) {
  recordAudit({
    category: "billing",
    action: "billing.subscribed",
    summary: `Activated ${planId} subscription`,
    pathname: "/billing",
    metadata: { planId },
  })
}

export function recordBillingPlanChanged(planId: string) {
  recordAudit({
    category: "billing",
    action: "billing.plan_changed",
    summary: `Changed plan to ${planId}`,
    pathname: "/billing",
    metadata: { planId },
  })
}

export function recordBillingCancelScheduled() {
  recordAudit({
    category: "billing",
    action: "billing.cancel_scheduled",
    summary: "Scheduled subscription cancellation",
    pathname: "/billing",
  })
}

export function recordBillingReactivated() {
  recordAudit({
    category: "billing",
    action: "billing.reactivated",
    summary: "Reactivated subscription",
    pathname: "/billing",
  })
}

export function recordThemeChanged(themeId: string) {
  recordAudit({
    category: "settings",
    action: "settings.theme_changed",
    summary: `Changed workspace theme to ${themeId}`,
    pathname: "/settings",
    metadata: { themeId },
  })
}

export function recordOnboardingCompleted(employeeId: string) {
  recordAudit({
    category: "employee",
    action: "onboarding.completed",
    summary: "Completed profile welcome onboarding",
    pathname: "/welcome",
    metadata: { employeeId },
  })
}

export function recordPreEmploymentInvited(email: string, name: string) {
  recordAudit({
    category: "employee",
    action: "pre_employment.invited",
    summary: `Sent pre-employment invite to ${name}`,
    pathname: "/employees/pre-employment",
    metadata: { email, name },
  })
}

export function recordPreEmploymentSubmitted(email: string, name: string) {
  recordAudit({
    category: "employee",
    action: "pre_employment.submitted",
    summary: `${name} submitted pre-employment forms`,
    pathname: "/join",
    metadata: { email, name },
  })
}

export function recordPreEmploymentApproved(email: string, name: string) {
  recordAudit({
    category: "employee",
    action: "pre_employment.approved",
    summary: `Approved pre-employment for ${name}`,
    pathname: "/employees/pre-employment",
    metadata: { email, name },
  })
}

export function recordRbacUpdated(role: string, permissionCount: number) {
  recordAudit({
    category: "security",
    action: "rbac.updated",
    summary: `Updated RBAC permissions for ${role}`,
    pathname: "/users-access",
    metadata: {
      role,
      permissionCount: String(permissionCount),
    },
  })
}

export function recordPrivacyConsent(
  employeeId: string,
  details: { version: string; ipAddress: string }
) {
  recordAudit({
    category: "compliance",
    action: "compliance.privacy_consent",
    summary: "Acknowledged Data Privacy Notice",
    pathname: "/privacy-consent",
    metadata: {
      employeeId,
      version: details.version,
      ipAddress: details.ipAddress,
    },
  })
}
