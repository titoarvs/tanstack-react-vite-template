import { redirect } from "@tanstack/react-router"
import {
  getPostLoginPath,
} from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { requireEmployeeWelcomeComplete } from "@/features/employee-welcome/routeGuards"
import { canViewEmployeeRecord, getEmployeeNavTarget } from "./accessPolicy"
import { can, canAccessEmployeesModule, canViewEmployeeDirectory, PERMISSIONS } from "./permissions"
import type { Permission } from "./permissions"
import { canAccessStaticModule } from "@/features/placeholders/staticModules"
import {
  isDemoOrganization,
  resolveOrganizationId,
  resolveOrganizationName,
} from "@/features/billing/organization"
import {
  ensureSubscriptionForOrg,
  getSubscription,
} from "@/features/billing/subscriptionStorage"
import {
  hasSubscriptionFeature,
  isSubscriptionUsable,
} from "@/features/billing/subscriptionPolicy"
import { getSession, isAuthenticated } from "./authStorage"
import type { SubscriptionFeature } from "@/features/billing/types"
import { canManageRbac } from "./rbac/rbacPolicy"

const SUBSCRIPTION_EXEMPT_PREFIXES = ["/billing", "/checkout", "/settings", "/welcome", "/join"]

function getOrgSubscriptionForSession() {
  const user = getSession()
  if (!user) return null
  const organizationId = resolveOrganizationId(user)
  const organizationName = resolveOrganizationName(user)
  return (
    getSubscription(organizationId) ??
    ensureSubscriptionForOrg(organizationId, organizationName, {
      demo: isDemoOrganization(organizationId),
    })
  )
}

export function requireAuth({ location }: { location: { pathname: string } }) {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: { redirect: location.pathname },
    })
  }
  requireEmployeeWelcomeComplete({ location })
}

/** Block app usage when trial ended or subscription canceled (billing routes exempt) */
export function requireActiveSubscription({
  location,
}: {
  location: { pathname: string }
}) {
  if (SUBSCRIPTION_EXEMPT_PREFIXES.some(p => location.pathname.startsWith(p))) {
    return
  }
  const subscription = getOrgSubscriptionForSession()
  if (!isSubscriptionUsable(subscription)) {
    throw redirect({ to: "/billing", search: { reason: "subscription_inactive" } })
  }
}

export function redirectIfAuthenticated() {
  if (!isAuthenticated()) return
  throw redirect({ to: getPostLoginPath(getSession()) })
}

export function requirePermission(permission: Permission) {
  return () => {
    const user = getSession()
    if (!user || !can(user, permission)) {
      throw redirect({ to: "/dashboard" })
    }
    if (permission === PERMISSIONS.EMPLOYEES_CREATE) {
      const subscription = getOrgSubscriptionForSession()
      if (!hasSubscriptionFeature(subscription, "employee_onboarding")) {
        throw redirect({ to: "/billing", search: { reason: "upgrade_required" } })
      }
    }
  }
}

const MODULE_SUBSCRIPTION_FEATURES: Partial<Record<string, SubscriptionFeature>> = {
  payroll: "payroll_module",
  compliance: "compliance_module",
  reports: "advanced_reports",
  users: "user_management",
}

/** Static sidebar modules under /modules/:moduleId */
export function requireStaticModule({
  params,
}: {
  params: { moduleId: string }
}) {
  const user = getSession()
  if (!user || !canAccessStaticModule(params.moduleId, user.role)) {
    throw redirect({ to: "/dashboard" })
  }
  const feature = MODULE_SUBSCRIPTION_FEATURES[params.moduleId]
  if (feature) {
    const subscription = getOrgSubscriptionForSession()
    if (!hasSubscriptionFeature(subscription, feature)) {
      throw redirect({ to: "/billing", search: { reason: "upgrade_required" } })
    }
  }
}

/** RBAC configuration — HRIS Super Admin only */
export function requireRbacManage() {
  return () => {
    const user = getSession()
    if (!user || !canManageRbac(user)) {
      throw redirect({ to: "/dashboard" })
    }
    const subscription = getOrgSubscriptionForSession()
    if (!hasSubscriptionFeature(subscription, "user_management")) {
      throw redirect({ to: "/billing", search: { reason: "upgrade_required" } })
    }
  }
}

/** Enterprise audit trail — admin + active subscription */
export function requireAuditLogAccess() {
  return () => {
    const user = getSession()
    if (!user || !can(user, PERMISSIONS.AUDIT_VIEW)) {
      throw redirect({ to: "/dashboard" })
    }
    const subscription = getOrgSubscriptionForSession()
    if (!hasSubscriptionFeature(subscription, "audit_log")) {
      throw redirect({ to: "/billing", search: { reason: "upgrade_required" } })
    }
  }
}

/** Directory list — HR/manager/admin only; employees redirect to own profile */
export function requireEmployeeDirectory() {
  return () => {
    const user = getSession()
    if (!user) {
      throw redirect({ to: "/login" })
    }
    if (canViewEmployeeDirectory(user)) return
    if (can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN) && user.employeeId) {
      throw redirect({
        to: "/employees/$employeeId",
        params: { employeeId: user.employeeId },
      })
    }
    throw redirect({ to: "/dashboard" })
  }
}

/** Any employee route entry — must have module access */
export function requireEmployeesModule() {
  return () => {
    const user = getSession()
    if (!user || !canAccessEmployeesModule(user)) {
      throw redirect({ to: "/dashboard" })
    }
  }
}

/** Employee detail — must be allowed to view that record */
export function requireEmployeeRecordAccess({
  params,
}: {
  params: { employeeId: string }
}) {
  const user = getSession()
  if (!user) {
    throw redirect({ to: "/login" })
  }
  const { employeeId } = params
  if (employeeId === "directory" || employeeId === "onboarding" || employeeId === "pre-employment")
    return

  if (canViewEmployeeRecord(user, employeeId)) return

  if (can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN) && user.employeeId) {
    throw redirect({
      to: "/employees/$employeeId",
      params: { employeeId: user.employeeId },
    })
  }

  throw redirect({ to: getEmployeeNavTarget(user) })
}
