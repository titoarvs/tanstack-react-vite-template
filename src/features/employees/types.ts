export type EmploymentType = "full-time" | "internship" | "contract"
export type EmployeeStatus = "active" | "inactive"
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
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  demographics: EmployeeDemographics
  contact: EmployeeContact
  photoUrl?: string
  department: string
  position: string
  managerId?: string
  employmentType: EmploymentType
  lifecycle: EmployeeLifecycle
  status: EmployeeStatus
  officeBranch: string
  /** Self-service welcome flow completed (employee login) */
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

export function getFullName(employee: Pick<Employee, "firstName" | "lastName">) {
  return `${employee.firstName} ${employee.lastName}`
}

export function getEmploymentTypeLabel(type: EmploymentType) {
  const labels: Record<EmploymentType, string> = {
    "full-time": "Full-Time",
    internship: "Internship",
    contract: "Contract",
  }
  return labels[type]
}
