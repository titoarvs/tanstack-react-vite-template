import type { ProfileTabValue } from "../employees/components/detail/EmployeeProfileHeader"
import { PROFILE_TABS } from "../employees/components/detail/EmployeeProfileHeader"
import type { Employee } from "../employees/types"
import { canViewEdmTab } from "../employees/edm/fieldPolicy"
import type { EdmTab } from "../employees/edm/types"
import { can, canViewEmployeeDirectory, PERMISSIONS } from "./permissions"
import type { AuthUser } from "./types"

const TAB_PERMISSION: Partial<
  Record<ProfileTabValue, (typeof PERMISSIONS)[keyof typeof PERMISSIONS]>
> = {
  personal: PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
  employment: PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
  compensation: PERMISSIONS.EMPLOYEES_PROFILE_COMPENSATION,
  government: PERMISSIONS.EMPLOYEES_PROFILE_GOVERNMENT,
  documents: PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
  compliance: PERMISSIONS.EMPLOYEES_PROFILE_COMPLIANCE,
  access: PERMISSIONS.EMPLOYEES_PROFILE_ACCESS,
  "time-off": PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
  performance: PERMISSIONS.EMPLOYEES_PROFILE_PERFORMANCE,
}

const EDM_TABS: readonly ProfileTabValue[] = [
  "personal",
  "employment",
  "compensation",
  "government",
  "documents",
  "compliance",
  "access",
]

const SENSITIVE_TABS: readonly ProfileTabValue[] = ["compensation", "performance"]

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
  if (tab === "performance") {
    if (isSelf(user, targetEmployeeId)) return true
    if (user.role === "manager" && employee && isDirectReport(user, employee)) return true
    return user.role === "hris_admin" || user.role === "hris_super_admin"
  }
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

function mapProfileTabToEdmTab(tab: ProfileTabValue): EdmTab | null {
  if (EDM_TABS.includes(tab)) return tab as EdmTab
  return null
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

  const edmTab = mapProfileTabToEdmTab(tab)
  if (edmTab && employee) {
    if (!canViewEdmTab(user, edmTab, targetEmployeeId, employee)) return false
  }

  const permission = TAB_PERMISSION[tab]
  if (permission && can(user, permission)) return true

  if (SENSITIVE_TABS.includes(tab)) {
    if (tab === "compensation") {
      if (isSelf(user, targetEmployeeId)) return true
      if (user.role === "hris_admin" || user.role === "hris_super_admin") return true
      if (user.role === "hrbp" && employee) {
        return canViewEdmTab(user, "compensation", targetEmployeeId, employee)
      }
      return false
    }
    return hasSensitiveTabAccess(user, targetEmployeeId, tab, employee)
  }

  if (edmTab && employee) {
    return canViewEdmTab(user, edmTab, targetEmployeeId, employee)
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
  const preferred: ProfileTabValue[] = [
    "personal",
    "employment",
    "compensation",
    "government",
    "documents",
    "compliance",
    "access",
    "time-off",
    "performance",
  ]
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

export function getEmployeeNavTarget(user: AuthUser | null | undefined): string {
  if (canViewEmployeeDirectory(user)) return "/employees/directory"
  if (user?.employeeId && can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN)) {
    return `/employees/${user.employeeId}`
  }
  return "/dashboard"
}
