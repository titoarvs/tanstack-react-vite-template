export type DocumentType =
  | "valid_id"
  | "student_id"
  | "job_offer"
  | "job_offer_signed_coo"
  | "employment_contract"
  | "moa"
  | "nda"
  | "non_compete"
  | "acceptable_use_policy"
  | "tor"
  | "diploma"
  | "medical_certificate"
  | "nbi_clearance"
  | "birth_certificate"
  | "marriage_certificate"
  | "sss_e1"
  | "philhealth_mdr"
  | "pagibig_mdf"
  | "tin_form"
  | "other"

export type DocumentCategory =
  | "pre_employment"
  | "employment_contracts"
  | "government_compliance"
  | "medical"

export type DocumentPhase =
  | "pre_employment"
  | "contract_signing"
  | "before_start"
  | "first_day"
  | "hr_countersign"

export type DocumentRequirementPriority = "required" | "secondary"

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
  signedName?: string
  signedAt?: string
  documentVersion?: string
  hrCountersignedBy?: string
  hrCountersignedAt?: string
}

export interface ChecklistItem {
  key: DocumentType | "requirements_complete"
  label: string
  status: "pending" | "complete" | "expired"
  completedAt?: string
  category?: DocumentCategory
  phase?: DocumentPhase
  priority?: DocumentRequirementPriority
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  valid_id: "Valid Government ID",
  student_id: "Student ID",
  job_offer: "Job Offer",
  job_offer_signed_coo: "Job Offer Signed by COO",
  employment_contract: "Employment Contract",
  moa: "Memorandum of Agreement (MOA)",
  nda: "Non-Disclosure Agreement (NDA)",
  non_compete: "Non-Compete Agreement",
  acceptable_use_policy: "Acceptable Use Policy",
  tor: "Transcript of Records (TOR)",
  diploma: "Diploma / Academic Certificates",
  medical_certificate: "Pre-employment Medical Exam",
  nbi_clearance: "NBI Clearance",
  birth_certificate: "PSA Birth Certificate",
  marriage_certificate: "Marriage Certificate",
  sss_e1: "SSS / E-1 Form",
  philhealth_mdr: "PhilHealth / MDR",
  pagibig_mdf: "Pag-IBIG / MDF",
  tin_form: "TIN (Tax Identification Number)",
  other: "Other",
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  pre_employment: "Pre-Employment",
  employment_contracts: "Employment Contracts",
  government_compliance: "Government & Compliance",
  medical: "Medical",
}

export const DOCUMENT_PHASE_LABELS: Record<DocumentPhase, string> = {
  pre_employment: "Pre-employment",
  contract_signing: "Contract signing",
  before_start: "Before start date",
  first_day: "First day",
  hr_countersign: "HR countersign",
}

/** @deprecated Use documentRequirementPolicy.getRequiredDocumentTypes instead */
export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "valid_id",
  "job_offer",
  "nda",
  "medical_certificate",
  "nbi_clearance",
]
