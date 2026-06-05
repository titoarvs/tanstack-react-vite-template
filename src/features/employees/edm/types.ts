import type { UserRole } from "@/features/auth/types"

export type EdmTab =
  | "personal"
  | "employment"
  | "compensation"
  | "government"
  | "documents"
  | "compliance"
  | "access"

export type FieldSensitivity = "internal" | "confidential" | "restricted"

export type FieldAccessLevel =
  | "hidden"
  | "view"
  | "edit"
  | "limited_view"
  | "view_own"
  | "edit_own"
  | "view_team"

export type EditAuthority =
  | "system"
  | "hris_super_admin"
  | "hris_admin"
  | "hrbp"
  | "employee"
  | "it"
  | "payroll"
  | "cb"
  | "dpo"

export type EdmFieldKey =
  | "employeeId"
  | "name"
  | "preferredName"
  | "employeePhoto"
  | "demographics"
  | "contact"
  | "address"
  | "emergencyContact"
  | "departmentPosition"
  | "supervisor"
  | "managerEmployeeId"
  | "orgStructure"
  | "workLocation"
  | "employmentType"
  | "employeeStatus"
  | "dateHired"
  | "dateContractSigned"
  | "probationRegularization"
  | "terminationDate"
  | "separationReason"
  | "monthlySalary"
  | "salaryGrade"
  | "compensationEffectiveDate"
  | "hmoCoverage"
  | "governmentIds"
  | "uploadedDocuments"
  | "documentMetadata"
  | "onboardingChecklist"
  | "privacyConsent"
  | "dataSubjectAccess"
  | "retentionDeletion"
  | "auditTrail"
  | "systemAccess"
  | "accessRequestStatus"
  | "provisionDates"

export interface EdmFieldDefinition {
  key: EdmFieldKey
  label: string
  tab: EdmTab
  sensitivity: FieldSensitivity
  editAuthority: EditAuthority
  approvalRequired: boolean
}

export interface FieldAccessContext {
  viewerRole: UserRole
  isSelf: boolean
  isDirectReport: boolean
  canViewRecord: boolean
}

export interface ResolvedFieldAccess {
  level: FieldAccessLevel
  canEdit: boolean
  canView: boolean
}

export type RoleMatrixEntry = Record<UserRole, FieldAccessLevel>
