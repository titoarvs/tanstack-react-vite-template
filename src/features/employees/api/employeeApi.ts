import { employeeStore } from "../../../lib/mock/employeeStore"
import type { EmployeeUpdatePatch } from "../../../lib/mock/employeeStore"
import {
  canViewEmployeeRecord,
  filterEmployeesForUser,
} from "../../auth/accessPolicy"
import {
  ForbiddenError,
  requireSessionPermission,
  requireSessionUser,
} from "../../auth/authErrors"
import {
  recordEmployeeCreated,
  recordEmployeeDeleted,
} from "@/features/audit/auditLogger"
import { getSession } from "../../auth/authStorage"
import { canAccessEmployeesModule, PERMISSIONS } from "../../auth/permissions"
import {
  isDemoOrganization,
  resolveOrganizationId,
  resolveOrganizationName,
} from "../../billing/organization"
import {
  canAddSeat,
  hasSubscriptionFeature,
} from "../../billing/subscriptionPolicy"
import {
  ensureSubscriptionForOrg,
  getSubscription,
} from "../../billing/subscriptionStorage"
import {
  canViewPayrollHistory,
} from "../edm/fieldPolicy"
import {
  stripEmployeeForViewer,
} from "../edm/stripEmployee"
import { getEmployeePayInsights } from "../data/mockEmployeeInsights"
import type { EmployeePayInsights } from "../data/mockEmployeeInsights"
import {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  getPositionsForDepartment,
  OFFICE_BRANCHES,
  ORG_LEVELS,
  SALARY_GRADES,
  WORK_LOCATIONS,
} from "../data/masterData"
import type { CreateEmployeeInput, Employee, EmployeeFilters } from "../types"
import { getFullName } from "../types"

export {
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  OFFICE_BRANCHES,
  ORG_LEVELS,
  SALARY_GRADES,
  WORK_LOCATIONS,
  getPositionsForDepartment,
}

export async function fetchEmployees(): Promise<Employee[]> {
  const user = requireSessionUser()
  if (!canAccessEmployeesModule(user)) {
    throw new ForbiddenError()
  }
  const list = await employeeStore.list()
  const filtered = filterEmployeesForUser(user, list)
  return filtered.map(e => stripEmployeeForViewer(user, e))
}

export async function fetchEmployee(id: string): Promise<Employee> {
  const user = requireSessionUser()
  if (!canAccessEmployeesModule(user)) {
    throw new ForbiddenError()
  }
  const employee = await employeeStore.getById(id)
  if (!employee) throw new Error("Employee not found")
  if (!canViewEmployeeRecord(user, id, employee)) {
    throw new ForbiddenError(
      "You do not have permission to view this employee record."
    )
  }
  return stripEmployeeForViewer(user, employee)
}

export async function fetchEmployeeRaw(id: string): Promise<Employee> {
  const user = requireSessionUser()
  const employee = await employeeStore.getById(id)
  if (!employee) throw new Error("Employee not found")
  if (!canViewEmployeeRecord(user, id, employee)) {
    throw new ForbiddenError()
  }
  return employee
}

export async function updateEmployeeSection(
  id: string,
  patch: EmployeeUpdatePatch
): Promise<Employee> {
  const user = requireSessionUser()
  if (!canViewEmployeeRecord(user, id)) {
    throw new ForbiddenError()
  }
  const updated = await employeeStore.updateEmployee(
    id,
    patch,
    user.email
  )
  return stripEmployeeForViewer(user, updated)
}

function getOrgSubscriptionForUser(
  user: NonNullable<ReturnType<typeof getSession>>
) {
  const organizationId = resolveOrganizationId(user)
  const organizationName = resolveOrganizationName(user)
  return (
    getSubscription(organizationId) ??
    ensureSubscriptionForOrg(organizationId, organizationName, {
      demo: isDemoOrganization(organizationId),
    })
  )
}

export async function createEmployee(
  input: CreateEmployeeInput
): Promise<Employee> {
  const user = requireSessionUser()
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  const subscription = getOrgSubscriptionForUser(user)
  if (!hasSubscriptionFeature(subscription, "employee_onboarding")) {
    throw new ForbiddenError(
      "Your plan does not include employee onboarding. Upgrade in Billing."
    )
  }
  const list = await employeeStore.list()
  if (!canAddSeat(subscription, list.length)) {
    throw new ForbiddenError(
      `Seat limit reached (${subscription.seatLimit}). Upgrade your plan or remove employees.`
    )
  }
  const existing = list.find(e => e.employeeId === input.employeeId)
  if (existing) throw new Error("Employee ID already exists")
  const created = await employeeStore.create({
    ...input,
    audit: { createdBy: user.email, updatedBy: user.email },
  })
  recordEmployeeCreated(
    created.employeeId,
    `${created.firstName} ${created.lastName}`.trim()
  )
  return stripEmployeeForViewer(user, created)
}

export async function deleteEmployee(id: string): Promise<void> {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_DELETE)
  const existing = await employeeStore.getById(id)
  const ok = await employeeStore.remove(id)
  if (!ok) throw new Error("Employee not found")
  if (existing) {
    recordEmployeeDeleted(
      existing.employeeId,
      `${existing.firstName} ${existing.lastName}`.trim()
    )
  }
}

export function fetchEmployeePayInsights(
  employeeId: string,
  employee?: Employee
): EmployeePayInsights {
  const user = getSession()
  if (!user) throw new ForbiddenError("Sign in required.")
  const record = employee ?? undefined
  if (!canViewPayrollHistory(user, employeeId, record)) {
    throw new ForbiddenError(
      "You do not have permission to view pay information for this employee."
    )
  }
  return getEmployeePayInsights(employeeId)
}

export function suggestEmployeeId(): string {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  return employeeStore.getNextEmployeeId()
}

export function filterEmployees(
  employees: Employee[],
  filters: EmployeeFilters
): Employee[] {
  const search = filters.search?.trim().toLowerCase()
  return employees.filter(e => {
    if (
      filters.status &&
      filters.status !== "all" &&
      e.status !== filters.status
    )
      return false
    if (
      filters.department &&
      filters.department !== "all" &&
      e.department !== filters.department
    )
      return false
    if (
      filters.employmentType &&
      filters.employmentType !== "all" &&
      e.employmentType !== filters.employmentType
    )
      return false
    if (
      filters.workLocation &&
      filters.workLocation !== "all" &&
      e.workLocation !== filters.workLocation
    )
      return false
    if (!search) return true
    const haystack = [
      e.employeeId,
      getFullName(e),
      e.contact.email,
      e.position,
      e.jobTitle,
      e.department,
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(search)
  })
}
