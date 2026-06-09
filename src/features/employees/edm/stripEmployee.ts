import type { AuthUser } from "@/features/auth/types"
import {
  canViewField,
  getVisibleFieldsForTab,
  resolveFieldAccess,
} from "./fieldPolicy"
import type { EdmTab } from "./types"
import type { Employee } from "../types"
import { formatCurrency } from "./fieldMasking"

/** Strip employee record to fields visible to viewer per EDM policy */
export function stripEmployeeForViewer(
  user: AuthUser,
  employee: Employee
): Employee {
  const targetId = employee.id
  const nameAccess = resolveFieldAccess(user, "name", targetId, employee)

  const stripped: Employee = {
    ...employee,
    compensation: undefined,
    governmentIds: undefined,
    separationReason: undefined,
    documents: undefined,
    compliance: undefined,
    systemAccess: undefined,
  }

  if (nameAccess.canView && nameAccess.level !== "limited_view") {
    // keep name fields
  } else if (nameAccess.level === "limited_view") {
    stripped.firstName = employee.firstName.charAt(0) + "."
    stripped.lastName = `${employee.lastName.charAt(0)}***`
    stripped.middleName = undefined
    stripped.suffix = undefined
  } else {
    stripped.firstName = ""
    stripped.lastName = ""
    stripped.middleName = undefined
    stripped.suffix = undefined
  }

  if (!canViewField(user, "preferredName", targetId, employee)) {
    stripped.preferredName = undefined
  }
  if (!canViewField(user, "employeePhoto", targetId, employee)) {
    stripped.photoUrl = undefined
  }
  if (!canViewField(user, "demographics", targetId, employee)) {
    stripped.demographics = {}
  }
  if (!canViewField(user, "contact", targetId, employee)) {
    stripped.contact = { ...stripped.contact, email: "", phone: "" }
  }
  if (!canViewField(user, "address", targetId, employee)) {
    stripped.contact = {
      ...stripped.contact,
      address: undefined,
    }
  }
  if (!canViewField(user, "emergencyContact", targetId, employee)) {
    stripped.emergencyContact = undefined
  }
  if (canViewField(user, "separationReason", targetId, employee)) {
    stripped.separationReason = employee.separationReason
  }
  if (canViewField(user, "monthlySalary", targetId, employee) ||
      canViewField(user, "salaryGrade", targetId, employee) ||
      canViewField(user, "hmoCoverage", targetId, employee)) {
    stripped.compensation = employee.compensation
  }
  if (canViewField(user, "governmentIds", targetId, employee)) {
    stripped.governmentIds = employee.governmentIds
  }
  if (canViewField(user, "uploadedDocuments", targetId, employee)) {
    stripped.documents = employee.documents
  }
  if (canViewField(user, "onboardingChecklist", targetId, employee)) {
    stripped.onboardingChecklist = employee.onboardingChecklist
  }
  if (
    canViewField(user, "privacyConsent", targetId, employee) ||
    canViewField(user, "dataSubjectAccess", targetId, employee) ||
    canViewField(user, "retentionDeletion", targetId, employee)
  ) {
    stripped.compliance = employee.compliance
  }
  if (canViewField(user, "auditTrail", targetId, employee)) {
    stripped.audit = employee.audit
  }
  if (canViewField(user, "systemAccess", targetId, employee)) {
    stripped.systemAccess = employee.systemAccess
  }

  return stripped
}

export function canViewEdmTabForEmployee(
  user: AuthUser,
  tab: EdmTab,
  employee: Employee
): boolean {
  return getVisibleFieldsForTab(user, tab, employee.id, employee).length > 0
}

export function formatCompensationDisplay(
  user: AuthUser,
  employee: Employee,
  field: "monthlySalary" | "salaryGrade" | "compensationEffectiveDate" | "hmoCoverage"
): string | undefined {
  const comp = employee.compensation
  if (!comp) return undefined

  switch (field) {
    case "monthlySalary":
      if (comp.monthlySalary == null) return undefined
      if (canViewField(user, "monthlySalary", employee.id, employee)) {
        return formatCurrency(comp.monthlySalary)
      }
      return undefined
    case "salaryGrade":
      return comp.salaryGrade
    case "compensationEffectiveDate":
      return comp.effectiveDate
    case "hmoCoverage":
      if (comp.hmoEnrolled == null) return undefined
      return comp.hmoEnrolled ? "Enrolled" : "Not enrolled"
    default:
      return undefined
  }
}
