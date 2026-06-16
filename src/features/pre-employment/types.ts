import type { EmploymentType } from "@/features/employees/types"
import type { WorkLocation } from "@/features/employees/data/masterData"
import type { DocumentType } from "@/features/employees/types/documents"
import type { ContractType } from "@/features/employees/lib/documentRequirementPolicy"

export type PreEmploymentStatus =
  | "invited"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled"

export interface PreEmploymentDocument {
  id: string
  type: DocumentType
  fileName: string
  mimeType: string
  uploadedAt: string
  dataUrl?: string
}

export interface ContractSignatureRecord {
  contractType: ContractType
  signedName: string
  signedAt: string
  documentVersion: string
  ipAddress?: string
  signatureDataUrl?: string
  hrCountersignedBy?: string
  hrCountersignedAt?: string
  hrSignatureDataUrl?: string
}

export interface PreEmploymentInvite {
  id: string
  token: string
  email: string
  firstName: string
  lastName: string
  intendedDepartment?: string
  intendedPosition?: string
  intendedHireDate?: string
  intendedEmploymentType: EmploymentType
  intendedWorkLocation: WorkLocation
  isAcademicInternship?: boolean
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

import type { EmployeeAddress } from "@/features/employees/types"

export interface PreEmploymentFormData {
  phone: string
  address?: EmployeeAddress
  dateOfBirth?: string
  gender?: string
  nationality?: string
  maritalStatus?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  preferredName?: string
  personalEmail?: string
  uploadedDocuments: PreEmploymentDocument[]
  contractSignatures: ContractSignatureRecord[]
  photoUrl?: string
  acknowledgeHandbook: boolean
}

export interface CreatePreEmploymentInviteInput {
  email: string
  firstName: string
  lastName: string
  intendedDepartment?: string
  intendedPosition?: string
  intendedHireDate?: string
  intendedEmploymentType: EmploymentType
  intendedWorkLocation: WorkLocation
  isAcademicInternship?: boolean
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
  hrContractCountersignatures?: ContractSignatureRecord[]
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

export function getPreEmploymentLegalName(
  invite: Pick<PreEmploymentInvite, "firstName" | "lastName">
): string {
  return getPreEmploymentFullName(invite)
}
