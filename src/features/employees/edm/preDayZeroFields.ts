import type { EdmFieldKey } from "./types"

/** Fields HR may populate before employee start date (Pre-Day 0) */
export const HR_PRE_DAY_ZERO_FIELDS: readonly EdmFieldKey[] = [
  "employeeId",
  "name",
  "departmentPosition",
  "supervisor",
  "managerEmployeeId",
  "orgStructure",
  "workLocation",
  "employmentType",
  "employeeStatus",
  "dateHired",
  "probationRegularization",
  "contact",
]

/** Fields collected only via employee self-service welcome flow */
export const EMPLOYEE_SELF_SERVICE_FIELDS: readonly EdmFieldKey[] = [
  "preferredName",
  "employeePhoto",
  "address",
  "emergencyContact",
  "privacyConsent",
  "dataSubjectAccess",
]

/** Fields excluded from HR onboarding wizard (restricted / post-hire) */
export const HR_ONBOARDING_EXCLUDED_FIELDS: readonly EdmFieldKey[] = [
  "governmentIds",
  "monthlySalary",
  "salaryGrade",
  "compensationEffectiveDate",
  "hmoCoverage",
  "separationReason",
  "uploadedDocuments",
  "systemAccess",
  "provisionDates",
]
