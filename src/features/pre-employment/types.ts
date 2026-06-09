export type PreEmploymentStatus =
  | "invited"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled"

export interface PreEmploymentInvite {
  id: string
  token: string
  email: string
  firstName: string
  lastName: string
  intendedDepartment?: string
  intendedPosition?: string
  intendedHireDate?: string
  status: PreEmploymentStatus
  candidatePayload: Partial<PreEmploymentFormData>
  rejectionNote?: string
  employeeRecordId?: string
  invitedBy: string
  invitedAt: string
  submittedAt?: string
  approvedAt?: string
  expiresAt?: string
}

export interface PreEmploymentFormData {
  phone: string
  address?: string
  province?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  maritalStatus?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  preferredName?: string
  personalEmail?: string
  photoUrl?: string
  acknowledgeHandbook: boolean
  acknowledgePrivacy: boolean
}

export interface CreatePreEmploymentInviteInput {
  email: string
  firstName: string
  lastName: string
  intendedDepartment?: string
  intendedPosition?: string
  intendedHireDate?: string
}

export interface ApprovePreEmploymentInput {
  employeeId: string
  department: string
  position: string
  jobTitle: string
  isManager: boolean
  managerId?: string
  workLocation: string
  employmentType: string
  statusDetail: string
  hireDate: string
  probationEndDate?: string
  regularizationDate?: string
  contractSignedDate: string
}

export interface ApprovePreEmploymentResult {
  invite: PreEmploymentInvite
  employeeId: string
  loginEmail: string
  tempPasswordHint: string
}

export const PRE_EMPLOYMENT_EDITABLE_STATUSES: PreEmploymentStatus[] = [
  "invited",
  "in_progress",
  "rejected",
]

export const PRE_EMPLOYMENT_WAITING_STATUSES: PreEmploymentStatus[] = ["submitted"]

export function getPreEmploymentStatusLabel(status: PreEmploymentStatus): string {
  const labels: Record<PreEmploymentStatus, string> = {
    invited: "Invited",
    in_progress: "In progress",
    submitted: "Awaiting review",
    approved: "Approved",
    rejected: "Changes requested",
    expired: "Expired",
    cancelled: "Cancelled",
  }
  return labels[status] ?? status
}

export function getPreEmploymentFullName(
  invite: Pick<PreEmploymentInvite, "firstName" | "lastName">
): string {
  return `${invite.firstName} ${invite.lastName}`.trim()
}
