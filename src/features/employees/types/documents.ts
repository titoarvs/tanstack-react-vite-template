export type DocumentType =
  | "valid_id"
  | "job_offer"
  | "job_offer_signed_coo"
  | "nda"
  | "non_compete"
  | "tor"
  | "diploma"
  | "medical_certificate"
  | "nbi_clearance"
  | "birth_certificate"
  | "other"

export interface EmployeeDocument {
  id: string
  type: DocumentType
  fileName: string
  uploadedBy: string
  uploadedAt: string
  expiryDate?: string
  version: number
  mimeType: string
  dataUrl?: string
}

export interface ChecklistItem {
  key: DocumentType | "requirements_complete"
  label: string
  status: "pending" | "complete" | "expired"
  completedAt?: string
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  valid_id: "Valid ID",
  job_offer: "Job Offer",
  job_offer_signed_coo: "Job Offer Signed by COO",
  nda: "NDA",
  non_compete: "Non-compete",
  tor: "Transcript of Records",
  diploma: "Diploma",
  medical_certificate: "Medical Certificate",
  nbi_clearance: "NBI Clearance",
  birth_certificate: "Birth Certificate",
  other: "Other",
}

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "valid_id",
  "job_offer",
  "nda",
  "medical_certificate",
  "nbi_clearance",
]
