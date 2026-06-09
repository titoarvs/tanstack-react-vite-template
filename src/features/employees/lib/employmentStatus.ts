import {
  ACTIVE_STATUS_DETAILS,
  CREATE_FORM_STATUS_DETAILS,
  EMPLOYEE_STATUSES,
  INACTIVE_STATUS_DETAILS,
  type ActiveStatusDetail,
  type MasterEmployeeStatus,
  type StatusDetail,
} from "../data/masterData"

export const EMPLOYMENT_STATUS_GROUPS = {
  pre_hire: { label: "Pre-hire", subStatuses: [] as const },
  active: { label: "Active", subStatuses: ACTIVE_STATUS_DETAILS },
  inactive: { label: "Inactive", subStatuses: INACTIVE_STATUS_DETAILS },
  terminated: { label: "Terminated", subStatuses: [] as const },
  onboarding: { label: "Onboarding", subStatuses: [] as const },
} as const

export { CREATE_FORM_STATUS_DETAILS }

export function getCreateFormStatusDetailOptions() {
  return CREATE_FORM_STATUS_DETAILS.map(s => ({ value: s.value, label: s.label }))
}

export function resolveStatusForCreate(statusDetail: ActiveStatusDetail): {
  status: MasterEmployeeStatus
  statusDetail: ActiveStatusDetail
} {
  return { status: "active", statusDetail }
}

export function isValidStatusDetailForStatus(
  status: MasterEmployeeStatus,
  detail?: StatusDetail
): boolean {
  if (!detail) return status === "terminated" || status === "pre_hire" || status === "onboarding"
  if (status === "active") {
    return ACTIVE_STATUS_DETAILS.some(s => s.value === detail)
  }
  if (status === "inactive") {
    return INACTIVE_STATUS_DETAILS.some(s => s.value === detail)
  }
  return false
}

export function getStatusOptions() {
  return EMPLOYEE_STATUSES.map(s => ({ value: s.value, label: s.label }))
}
