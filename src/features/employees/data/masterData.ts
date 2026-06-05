/** Configurable master lists per EDM spec */

export const DEPARTMENTS = [
  "Finance Division",
  "Engineering",
  "Marketing",
  "Human Resources",
  "Operations",
  "Product",
] as const

export type Department = (typeof DEPARTMENTS)[number]

export const POSITIONS_BY_DEPARTMENT: Record<Department, readonly string[]> = {
  "Finance Division": ["Accountant", "Finance Manager", "Payroll Specialist"],
  Engineering: [
    "Software Engineer",
    "Senior Software Engineer",
    "Engineering Manager",
    "QA Engineer",
  ],
  Marketing: ["Marketing Intern", "Marketing Specialist", "Marketing Director"],
  "Human Resources": ["HR Generalist", "HR Manager", "Recruiter"],
  Operations: ["Operations Coordinator", "Operations Manager"],
  Product: ["Product Manager", "Product Designer", "Product Analyst"],
}

export const ALL_POSITIONS = Object.values(POSITIONS_BY_DEPARTMENT).flat()

export const EMPLOYMENT_TYPES = [
  { value: "regular", label: "Regular" },
  { value: "probationary", label: "Probationary" },
  { value: "consultant", label: "Consultant" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const

export type MasterEmploymentType = (typeof EMPLOYMENT_TYPES)[number]["value"]

/** @deprecated legacy values mapped via normalizeEmployee */
export type LegacyEmploymentType = "full-time" | "internship" | "contract"

export const EMPLOYEE_STATUSES = [
  { value: "active", label: "Active" },
  { value: "onboarding", label: "Onboarding" },
  { value: "on_leave", label: "On Leave" },
  { value: "resigned", label: "Resigned" },
  { value: "terminated", label: "Terminated" },
  { value: "inactive", label: "Inactive" },
] as const

export type MasterEmployeeStatus = (typeof EMPLOYEE_STATUSES)[number]["value"]

export const WORK_LOCATIONS = [
  { value: "office", label: "Office" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
] as const

export type WorkLocation = (typeof WORK_LOCATIONS)[number]["value"]

export const ORG_LEVELS = [
  "Individual Contributor",
  "Team Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level",
] as const

export const BUSINESS_UNITS = [
  "Corporate",
  "Technology",
  "Commercial",
  "Operations",
  "Finance",
] as const

export const SALARY_GRADES = [
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
] as const

export const OFFICE_BRANCHES = ["Jakarta", "Bandung", "Surabaya", "Manila"] as const

export const PROBATION_MONTHS_DEFAULT = 6

export const RETENTION_YEARS_DEFAULT = 5

export function getPositionsForDepartment(department: string): string[] {
  const key = department as Department
  if (key in POSITIONS_BY_DEPARTMENT) {
    return [...POSITIONS_BY_DEPARTMENT[key]]
  }
  return [...ALL_POSITIONS]
}

export function getEmploymentTypeLabel(value: string): string {
  return EMPLOYMENT_TYPES.find(t => t.value === value)?.label ?? value
}

export function getEmployeeStatusLabel(value: string): string {
  return EMPLOYEE_STATUSES.find(s => s.value === value)?.label ?? value
}

export function getWorkLocationLabel(value: string): string {
  return WORK_LOCATIONS.find(w => w.value === value)?.label ?? value
}
