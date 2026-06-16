import { employeeStore } from "@/lib/mock/employeeStore"
import type { AuthUser } from "@/features/auth/types"
import type { Employee } from "@/features/employees/types"
import { getFirstDayRequirements } from "@/features/employees/lib/documentRequirementPolicy"
import { needsPrivacyConsent } from "@/features/compliance/lib/privacyConsentPolicy"

export function getLinkedEmployee(
  user: AuthUser | null | undefined
): Employee | undefined {
  if (!user?.employeeId) return undefined
  return employeeStore.getByIdSync(user.employeeId)
}

function needsFirstDayComplianceComplete(employee: Employee): boolean {
  const ctx = {
    employmentType: employee.employmentType,
    workLocation: employee.workLocation,
    maritalStatus: employee.demographics?.maritalStatus,
  }
  const reqs = getFirstDayRequirements(ctx)
  const c = employee.compliance ?? {}

  for (const req of reqs) {
    if (req.type === "nda" && !c.ndaSignedAt) return true
    if (req.type === "non_compete" && !c.nonCompeteSignedAt) return true
    if (req.type === "acceptable_use_policy" && !c.acceptableUseSignedAt)
      return true
  }

  return false
}

/** New hires must finish welcome onboarding before the app shell */
export function needsEmployeeWelcomeOnboarding(
  user: AuthUser | null | undefined
): boolean {
  if (!user || user.role !== "employee" || !user.employeeId) return false
  const employee = getLinkedEmployee(user)
  if (!employee) return false

  if (needsPrivacyConsent(user)) return true
  if (needsFirstDayComplianceComplete(employee)) return true

  if (employee.preEmploymentCompletedAt) return false

  if (employee.status === "onboarding") return true
  return employee.profileOnboardingComplete !== true
}

export function isPreEmploymentWelcomePath(employee: Employee): boolean {
  return Boolean(employee.preEmploymentCompletedAt)
}

export function getPostLoginPath(
  user: AuthUser | null | undefined,
  redirect?: string
): string {
  if (needsPrivacyConsent(user)) return "/welcome"

  if (
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    redirect !== "/login" &&
    redirect !== "/welcome"
  ) {
    if (needsEmployeeWelcomeOnboarding(user)) return "/welcome"
    return redirect
  }
  if (needsEmployeeWelcomeOnboarding(user)) return "/welcome"
  return "/dashboard"
}

/** Typed navigate target for TanStack Router (avoids `to: string` param errors). */
export type PostLoginNavigateTarget =
  | { to: "/welcome" }
  | { to: "/dashboard" }
  | { to: "/settings" }
  | { to: "/billing" }
  | { to: "/users-access" }
  | { to: "/audit-log" }
  | { to: "/employees/directory" }
  | { to: "/employees/onboarding" }
  | { to: "/employees/pre-employment" }
  | { to: "/employees/pre-employment/$inviteId"; params: { inviteId: string } }
  | { to: "/employees/$employeeId"; params: { employeeId: string } }
  | { to: "/modules/$moduleId"; params: { moduleId: string } }
  | { to: "/audit-log/$entryId"; params: { entryId: string } }

function parseAppNavigateTarget(path: string): PostLoginNavigateTarget {
  switch (path) {
    case "/welcome":
      return { to: "/welcome" }
    case "/dashboard":
      return { to: "/dashboard" }
    case "/settings":
      return { to: "/settings" }
    case "/billing":
      return { to: "/billing" }
    case "/users-access":
      return { to: "/users-access" }
    case "/audit-log":
      return { to: "/audit-log" }
    case "/employees/directory":
      return { to: "/employees/directory" }
    case "/employees/onboarding":
      return { to: "/employees/onboarding" }
    case "/employees/pre-employment":
      return { to: "/employees/pre-employment" }
    default:
      break
  }

  const preEmploymentReview = /^\/employees\/pre-employment\/([^/]+)$/.exec(
    path
  )
  if (preEmploymentReview) {
    return {
      to: "/employees/pre-employment/$inviteId",
      params: { inviteId: preEmploymentReview[1] },
    }
  }

  const moduleMatch = /^\/modules\/([^/]+)$/.exec(path)
  if (moduleMatch) {
    return { to: "/modules/$moduleId", params: { moduleId: moduleMatch[1] } }
  }

  const auditEntry = /^\/audit-log\/([^/]+)$/.exec(path)
  if (auditEntry) {
    return { to: "/audit-log/$entryId", params: { entryId: auditEntry[1] } }
  }

  const employeeMatch = /^\/employees\/([^/]+)$/.exec(path)
  if (employeeMatch) {
    return {
      to: "/employees/$employeeId",
      params: { employeeId: employeeMatch[1] },
    }
  }

  return { to: "/dashboard" }
}

export function resolvePostLoginNavigation(
  user: AuthUser | null | undefined,
  redirect?: string
): PostLoginNavigateTarget {
  return parseAppNavigateTarget(getPostLoginPath(user, redirect))
}
