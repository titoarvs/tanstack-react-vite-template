import { employeeStore } from "@/lib/mock/employeeStore"
import type { AuthUser } from "@/features/auth/types"
import type { Employee } from "@/features/employees/types"

function getLinkedEmployee(user: AuthUser | null | undefined): Employee | undefined {
  if (!user?.employeeId) return undefined
  return employeeStore.getByIdSync(user.employeeId)
}

/** Employees must acknowledge the Privacy Notice before ESS access or profile data entry. */
export function needsPrivacyConsent(user: AuthUser | null | undefined): boolean {
  if (!user || user.role !== "employee" || !user.employeeId) return false
  const employee = getLinkedEmployee(user)
  if (!employee) return false
  return employee.compliance?.privacyConsentSigned !== true
}
