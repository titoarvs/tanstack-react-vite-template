import type { MasterEmploymentType, MasterEmployeeStatus, WorkLocation } from "./data/masterData"
import type { ChecklistItem, EmployeeDocument } from "./types/documents"

export type EmploymentType = MasterEmploymentType
export type EmployeeStatus = MasterEmployeeStatus
export type Gender = "male" | "female" | "other" | "prefer-not-to-say"

export interface EmployeeDemographics {
  dateOfBirth?: string
  gender?: Gender
  nationality?: string
  maritalStatus?: string
}

export interface EmployeeContact {
  email: string
  phone: string
  address?: string
  province?: string
}

export interface EmployeeEmergencyContact {
  name?: string
  phone?: string
  relationship?: string
}

export interface EmployeeLifecycle {
  hireDate: string
  probationEndDate?: string
  contractStartDate?: string
  contractEndDate?: string
  terminationDate?: string
  regularizationDate?: string
}

export interface EmployeeCompensation {
  monthlySalary?: number
  salaryGrade?: string
  effectiveDate?: string
  hmoEnrolled?: boolean
}

export interface EmployeeGovernmentIds {
  tin?: string
  sss?: string
  philHealth?: string
  pagIbig?: string
}

export interface EmployeeCompliance {
  privacyConsentSigned?: boolean
  privacyConsentDate?: string
  dataSubjectAccessSigned?: boolean
  retentionPeriodYears?: number
  dataDeletionDate?: string
}

export interface SystemAccessEntry {
  id: string
  name: string
  requestStatus: "pending" | "approved" | "rejected" | "provisioned" | "deprovisioned"
  provisionedDate?: string
  deprovisionedDate?: string
}

export interface EmployeeSystemAccess {
  systems: SystemAccessEntry[]
}

export interface EmployeeAudit {
  createdBy?: string
  updatedBy?: string
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string
  suffix?: string
  demographics: EmployeeDemographics
  contact: EmployeeContact
  photoUrl?: string
  department: string
  position: string
  managerId?: string
  orgLevel?: string
  businessUnit?: string
  costCenter?: string
  workLocation?: WorkLocation
  employmentType: EmploymentType
  lifecycle: EmployeeLifecycle
  status: EmployeeStatus
  officeBranch: string
  contractSignedDate?: string
  regularizationDate?: string
  separationReason?: string
  compensation?: EmployeeCompensation
  governmentIds?: EmployeeGovernmentIds
  compliance?: EmployeeCompliance
  systemAccess?: EmployeeSystemAccess
  documents?: EmployeeDocument[]
  onboardingChecklist?: ChecklistItem[]
  audit?: EmployeeAudit
  profileOnboardingComplete?: boolean
  profileOnboardingCompletedAt?: string
  preferredName?: string
  personalEmail?: string
  emergencyContact?: EmployeeEmergencyContact
  createdAt: string
  updatedAt: string
}

export type CreateEmployeeInput = Omit<Employee, "id" | "createdAt" | "updatedAt">

export interface EmployeeFilters {
  search?: string
  status?: EmployeeStatus | "all"
  department?: string | "all"
  employmentType?: EmploymentType | "all"
  officeBranch?: string | "all"
}

export function getFullName(
  employee: Pick<Employee, "firstName" | "lastName" | "middleName" | "suffix">
) {
  const parts = [
    employee.firstName,
    employee.middleName,
    employee.lastName,
    employee.suffix,
  ].filter(Boolean)
  return parts.join(" ")
}

export function getDisplayName(employee: Employee) {
  return employee.preferredName?.trim() || getFullName(employee)
}

export function getEmploymentTypeLabel(type: EmploymentType) {
  const labels: Record<EmploymentType, string> = {
    regular: "Regular",
    probationary: "Probationary",
    consultant: "Consultant",
    contract: "Contract",
    internship: "Internship",
  }
  return labels[type] ?? type
}

export function getEmployeeStatusLabel(status: EmployeeStatus) {
  const labels: Record<EmployeeStatus, string> = {
    active: "Active",
    on_leave: "On Leave",
    resigned: "Resigned",
    terminated: "Terminated",
    inactive: "Inactive",
  }
  return labels[status] ?? status
}

export type { EmployeeDocument, ChecklistItem, DocumentType } from "./types/documents"
