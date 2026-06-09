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

export const JOB_TITLES_BY_DEPARTMENT: Record<Department, readonly string[]> = {
  "Finance Division": [
    "Junior Accountant",
    "Senior Accountant",
    "Finance Manager",
    "Payroll Specialist",
  ],
  Engineering: [
    "Software Engineer I",
    "Software Engineer II",
    "Senior Software Engineer",
    "Engineering Manager",
    "QA Engineer",
  ],
  Marketing: [
    "Marketing Intern",
    "Marketing Specialist",
    "Senior Marketing Specialist",
    "Marketing Director",
  ],
  "Human Resources": [
    "HR Generalist",
    "Senior HR Generalist",
    "HR Manager",
    "Recruiter",
  ],
  Operations: [
    "Operations Coordinator",
    "Senior Operations Coordinator",
    "Operations Manager",
  ],
  Product: [
    "Associate Product Manager",
    "Product Manager",
    "Senior Product Manager",
    "Product Designer",
    "Product Analyst",
  ],
}

export const ALL_POSITIONS = Object.values(POSITIONS_BY_DEPARTMENT).flat()
export const ALL_JOB_TITLES = Object.values(JOB_TITLES_BY_DEPARTMENT).flat()

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "intern", label: "Intern" },
] as const

export type MasterEmploymentType = (typeof EMPLOYMENT_TYPES)[number]["value"]

/** @deprecated legacy values mapped via normalizeEmployee */
export type LegacyEmploymentType =
  | "full-time"
  | "internship"
  | "contract"
  | "regular"
  | "probationary"
  | "consultant"

export const EMPLOYEE_STATUSES = [
  { value: "pre_hire", label: "Pre-hire" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
  { value: "onboarding", label: "Onboarding" },
] as const

export type MasterEmployeeStatus = (typeof EMPLOYEE_STATUSES)[number]["value"]

export const ACTIVE_STATUS_DETAILS = [
  { value: "regular", label: "Regular" },
  { value: "probationary", label: "Probationary" },
] as const

export type ActiveStatusDetail = (typeof ACTIVE_STATUS_DETAILS)[number]["value"]

export const INACTIVE_STATUS_DETAILS = [
  { value: "on_leave", label: "On leave" },
  { value: "loa", label: "LOA" },
  { value: "awol", label: "AWOL" },
] as const

export type InactiveStatusDetail = (typeof INACTIVE_STATUS_DETAILS)[number]["value"]

export type StatusDetail = ActiveStatusDetail | InactiveStatusDetail

export const CREATE_FORM_STATUS_DETAILS = ACTIVE_STATUS_DETAILS

export const WORK_LOCATIONS = [
  { value: "onsite", label: "Onsite" },
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

/** @deprecated Use workLocation instead; kept for legacy record reads */
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

export function getJobTitlesForDepartment(department: string): string[] {
  const key = department as Department
  if (key in JOB_TITLES_BY_DEPARTMENT) {
    return [...JOB_TITLES_BY_DEPARTMENT[key]]
  }
  return [...ALL_JOB_TITLES]
}

export function getEmploymentTypeLabel(value: string): string {
  return EMPLOYMENT_TYPES.find(t => t.value === value)?.label ?? value
}

export function getEmployeeStatusLabel(value: string): string {
  return EMPLOYEE_STATUSES.find(s => s.value === value)?.label ?? value
}

export function getStatusDetailLabel(value: string): string {
  const active = ACTIVE_STATUS_DETAILS.find(s => s.value === value)
  if (active) return active.label
  const inactive = INACTIVE_STATUS_DETAILS.find(s => s.value === value)
  return inactive?.label ?? value
}

export function getFullStatusLabel(status: string, statusDetail?: string): string {
  const base = getEmployeeStatusLabel(status)
  if (!statusDetail) return base
  return `${base} (${getStatusDetailLabel(statusDetail)})`
}

export function isActiveSubStatus(value: string): value is ActiveStatusDetail {
  return ACTIVE_STATUS_DETAILS.some(s => s.value === value)
}

export function getWorkLocationLabel(value: string): string {
  if (value === "office") return "Onsite"
  return WORK_LOCATIONS.find(w => w.value === value)?.label ?? value
}
