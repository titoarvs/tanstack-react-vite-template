import type { ActiveStatusDetail } from "@/features/employees/data/masterData"
import type { WorkLocation } from "@/features/employees/data/masterData"
import type { MasterEmploymentType } from "@/features/employees/data/masterData"

export interface ManatalEmploymentSnapshot {
  department?: string
  position?: string
  jobTitle?: string
  managerId?: string
  workLocation?: WorkLocation
  employmentType?: MasterEmploymentType
  statusDetail?: ActiveStatusDetail
  hireDate?: string
  contractSignedDate?: string
  isManager?: boolean
}

export interface ManatalPrefillContext {
  intendedDepartment?: string
  intendedPosition?: string
  intendedHireDate?: string
  inviteId?: string
}

export function getMockManatalSnapshot(
  context?: ManatalPrefillContext
): ManatalEmploymentSnapshot {
  const department = context?.intendedDepartment ?? "Engineering"
  const position = context?.intendedPosition ?? "Software Engineer"
  const hireDate =
    context?.intendedHireDate ?? new Date().toISOString().slice(0, 10)

  return {
    department,
    position,
    jobTitle: position === "Software Engineer" ? "Software Engineer I" : position,
    workLocation: "hybrid",
    employmentType: "full_time",
    statusDetail: "probationary",
    hireDate,
    contractSignedDate: hireDate,
    isManager: false,
  }
}

export function prefillEmploymentFromManatal(
  context?: ManatalPrefillContext
): Partial<ManatalEmploymentSnapshot> {
  return getMockManatalSnapshot(context)
}
