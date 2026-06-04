import { employeeStore } from "../../../lib/mock/employeeStore"
import {
  canViewEmployeeRecord,
  canViewProfileTab,
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
import { provisionPortalUser } from "../../auth/provisionedUserStorage"
import { canAccessEmployeesModule, PERMISSIONS } from "../../auth/permissions"
import {
  isDemoOrganization,
  resolveOrganizationId,
  resolveOrganizationName,
} from "../../billing/organization"
import { canAddSeat, hasSubscriptionFeature } from "../../billing/subscriptionPolicy"
import {
  ensureSubscriptionForOrg,
  getSubscription,
} from "../../billing/subscriptionStorage"
import { getEmployeePayInsights } from "../data/mockEmployeeInsights"
import type { EmployeePayInsights } from "../data/mockEmployeeInsights"
import type { CreateEmployeeInput, Employee, EmployeeFilters } from "../types"
import { getFullName } from "../types"

export async function fetchEmployees(): Promise<Employee[]> {
  const user = requireSessionUser()
  if (!canAccessEmployeesModule(user)) {
    throw new ForbiddenError()
  }
  const list = await employeeStore.list()
  return filterEmployeesForUser(user, list)
}

export async function fetchEmployee(id: string): Promise<Employee> {
  const user = requireSessionUser()
  if (!canAccessEmployeesModule(user)) {
    throw new ForbiddenError()
  }
  const employee = await employeeStore.getById(id)
  if (!employee) throw new Error("Employee not found")
  if (!canViewEmployeeRecord(user, id, employee)) {
    throw new ForbiddenError("You do not have permission to view this employee record.")
  }
  return employee
}

function getOrgSubscriptionForUser(user: NonNullable<ReturnType<typeof getSession>>) {
  const organizationId = resolveOrganizationId(user)
  const organizationName = resolveOrganizationName(user)
  return (
    getSubscription(organizationId) ??
    ensureSubscriptionForOrg(organizationId, organizationName, {
      demo: isDemoOrganization(organizationId),
    })
  )
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  const user = requireSessionUser()
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  const subscription = getOrgSubscriptionForUser(user)
  if (!hasSubscriptionFeature(subscription, "employee_onboarding")) {
    throw new ForbiddenError("Your plan does not include employee onboarding. Upgrade in Billing.")
  }
  const list = await employeeStore.list()
  if (!canAddSeat(subscription, list.length)) {
    throw new ForbiddenError(
      `Seat limit reached (${subscription.seatLimit}). Upgrade your plan or remove employees.`
    )
  }
  const existing = list.find(e => e.employeeId === input.employeeId)
  if (existing) throw new Error("Employee ID already exists")
  const created = await employeeStore.create(input)
  provisionPortalUser({
    email: created.contact.email,
    employeeId: created.id,
    name: `${created.firstName} ${created.lastName}`.trim(),
    organizationId: resolveOrganizationId(user),
    organizationName: resolveOrganizationName(user),
  })
  recordEmployeeCreated(
    created.employeeId,
    `${created.firstName} ${created.lastName}`.trim()
  )
  return created
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
  if (!canViewProfileTab(user, employeeId, "pay-info", record)) {
    throw new ForbiddenError("You do not have permission to view pay information for this employee.")
  }
  return getEmployeePayInsights(employeeId)
}

export function suggestEmployeeId(extraReserved: Iterable<string> = []): string {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  return employeeStore.getNextEmployeeId(extraReserved)
}

export function filterEmployees(employees: Employee[], filters: EmployeeFilters): Employee[] {
  const search = filters.search?.trim().toLowerCase()
  return employees.filter(e => {
    if (filters.status && filters.status !== "all" && e.status !== filters.status) return false
    if (filters.department && filters.department !== "all" && e.department !== filters.department)
      return false
    if (
      filters.employmentType &&
      filters.employmentType !== "all" &&
      e.employmentType !== filters.employmentType
    )
      return false
    if (filters.officeBranch && filters.officeBranch !== "all" && e.officeBranch !== filters.officeBranch)
      return false
    if (!search) return true
    const haystack = [
      e.employeeId,
      getFullName(e),
      e.contact.email,
      e.position,
      e.department,
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(search)
  })
}

export const DEPARTMENTS = [
  "Finance Division",
  "Engineering",
  "Marketing",
  "Human Resources",
  "Operations",
  "Product",
] as const

export const OFFICE_BRANCHES = ["Jakarta", "Bandung", "Surabaya"] as const
