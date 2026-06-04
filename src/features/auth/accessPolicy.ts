import type { ProfileTabValue } from "../employees/components/detail/EmployeeProfileHeader"
import { PROFILE_TABS } from "../employees/components/detail/EmployeeProfileHeader"
import type { Employee } from "../employees/types"
import { can, canViewEmployeeDirectory, PERMISSIONS } from "./permissions"
import type { AuthUser } from "./types"

const TAB_PERMISSION: Partial<Record<ProfileTabValue, (typeof PERMISSIONS)[keyof typeof PERMISSIONS]>> = {
  personal: PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  job: PERMISSIONS.EMPLOYEES_PROFILE_JOB,
  "time-off": PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
  "pay-info": PERMISSIONS.EMPLOYEES_PROFILE_PAY,
  performance: PERMISSIONS.EMPLOYEES_PROFILE_PERFORMANCE,
}

const SENSITIVE_TABS: readonly ProfileTabValue[] = ["pay-info", "performance"]

export function isSelf(user: AuthUser | null | undefined, employeeId: string): boolean {
  return Boolean(user?.employeeId && user.employeeId === employeeId)
}

export function isDirectReport(user: AuthUser | null | undefined, employee: Employee): boolean {
  return Boolean(user?.employeeId && employee.managerId === user.employeeId)
}

function hasSensitiveTabAccess(
  user: AuthUser,
  targetEmployeeId: string,
  tab: ProfileTabValue,
  employee?: Employee
): boolean {
  if (tab !== "pay-info" && tab !== "performance") return false
  if (isSelf(user, targetEmployeeId)) return true
  if (user.role === "manager" && employee && isDirectReport(user, employee)) return true
  return false
}

export function canViewEmployeeRecord(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  if (!user) return false
  if (canViewEmployeeDirectory(user)) return true
  if (can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN) && isSelf(user, targetEmployeeId)) return true
  if (user.role === "manager" && employee && isDirectReport(user, employee)) return true
  return false
}

export function canViewProfileTab(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  tab: ProfileTabValue,
  employee?: Employee
): boolean {
  if (!user) return false
  if (!canViewEmployeeRecord(user, targetEmployeeId, employee)) return false

  const tabDef = PROFILE_TABS.find(t => t.value === tab)
  if (!tabDef || ("disabled" in tabDef && tabDef.disabled)) return false

  const permission = TAB_PERMISSION[tab]
  if (permission && can(user, permission)) return true

  if (SENSITIVE_TABS.includes(tab)) {
    return hasSensitiveTabAccess(user, targetEmployeeId, tab, employee)
  }

  return false
}

export function canUseSelfService(
  user: AuthUser | null | undefined,
  targetEmployeeId: string
): boolean {
  if (!user) return false
  return (
    can(user, PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE) &&
    isSelf(user, targetEmployeeId) &&
    canViewEmployeeRecord(user, targetEmployeeId)
  )
}

export function getVisibleProfileTabs(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  employee?: Employee
) {
  return PROFILE_TABS.filter(tab => {
    if ("disabled" in tab && tab.disabled) return false
    return canViewProfileTab(user, targetEmployeeId, tab.value, employee)
  })
}

export function getDefaultProfileTab(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  employee?: Employee
): ProfileTabValue {
  const visible = getVisibleProfileTabs(user, targetEmployeeId, employee)
  const preferred: ProfileTabValue[] = ["personal", "job", "time-off", "pay-info", "performance"]
  for (const tab of preferred) {
    if (visible.some(t => t.value === tab)) return tab
  }
  return visible[0]?.value ?? "personal"
}

export function filterEmployeesForUser(
  user: AuthUser | null | undefined,
  employees: Employee[]
): Employee[] {
  if (!user) return []
  if (canViewEmployeeDirectory(user)) return employees

  const visible = new Map<string, Employee>()
  if (can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN) && user.employeeId) {
    const self = employees.find(e => e.id === user.employeeId)
    if (self) visible.set(self.id, self)
  }
  if (user.role === "manager" && user.employeeId) {
    for (const e of employees) {
      if (isDirectReport(user, e)) visible.set(e.id, e)
    }
  }
  return Array.from(visible.values())
}

/** Sidebar / index redirect target for the Employee nav item */
export function getEmployeeNavTarget(user: AuthUser | null | undefined): string {
  if (canViewEmployeeDirectory(user)) return "/employees/directory"
  if (user?.employeeId && can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN)) {
    return `/employees/${user.employeeId}`
  }
  return "/dashboard"
}
