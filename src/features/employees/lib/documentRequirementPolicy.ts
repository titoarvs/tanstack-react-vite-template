import type { EmploymentType } from "../types"
import type { WorkLocation } from "../data/masterData"
import type {
  DocumentCategory,
  DocumentPhase,
  DocumentRequirementPriority,
  DocumentType,
  ChecklistItem,
  EmployeeDocument,
} from "../types/documents"
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_LABELS,
} from "../types/documents"

export interface DocumentRequirementContext {
  employmentType: EmploymentType
  workLocation: WorkLocation
  maritalStatus?: string
  isAcademicInternship?: boolean
}

export interface DocumentRequirementRule {
  type: DocumentType
  category: DocumentCategory
  phase: DocumentPhase
  priority: DocumentRequirementPriority
  minCount?: number
  appliesTo: (ctx: DocumentRequirementContext) => boolean
}

export interface DocumentRequirement {
  type: DocumentType
  label: string
  category: DocumentCategory
  categoryLabel: string
  phase: DocumentPhase
  priority: DocumentRequirementPriority
  minCount: number
}

export type ContractType = "job_offer" | "employment_contract" | "moa"

export const CONTRACT_TYPE_TO_DOCUMENT: Record<ContractType, DocumentType> = {
  job_offer: "job_offer",
  employment_contract: "employment_contract",
  moa: "moa",
}

const DOCUMENT_RULES: DocumentRequirementRule[] = [
  {
    type: "valid_id",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "required",
    minCount: 1,
    appliesTo: () => true,
  },
  {
    type: "valid_id",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "required",
    minCount: 2,
    appliesTo: ctx => ctx.employmentType === "part_time",
  },
  {
    type: "student_id",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "intern",
  },
  {
    type: "nbi_clearance",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "tor",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "secondary",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "diploma",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "secondary",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "birth_certificate",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "required",
    appliesTo: ctx =>
      ctx.employmentType === "full_time" || ctx.employmentType === "intern",
  },
  {
    type: "marriage_certificate",
    category: "pre_employment",
    phase: "pre_employment",
    priority: "secondary",
    appliesTo: ctx => ctx.maritalStatus?.toLowerCase() === "married",
  },
  {
    type: "medical_certificate",
    category: "medical",
    phase: "pre_employment",
    priority: "required",
    appliesTo: ctx => {
      if (ctx.employmentType === "full_time") return true
      if (ctx.workLocation === "onsite" || ctx.workLocation === "hybrid") return true
      return false
    },
  },
  {
    type: "sss_e1",
    category: "government_compliance",
    phase: "before_start",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "philhealth_mdr",
    category: "government_compliance",
    phase: "before_start",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "pagibig_mdf",
    category: "government_compliance",
    phase: "before_start",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "tin_form",
    category: "government_compliance",
    phase: "before_start",
    priority: "required",
    appliesTo: ctx => ctx.employmentType === "full_time",
  },
  {
    type: "job_offer",
    category: "employment_contracts",
    phase: "contract_signing",
    priority: "required",
    appliesTo: () => true,
  },
  {
    type: "employment_contract",
    category: "employment_contracts",
    phase: "contract_signing",
    priority: "required",
    appliesTo: () => true,
  },
  {
    type: "moa",
    category: "employment_contracts",
    phase: "contract_signing",
    priority: "required",
    appliesTo: ctx =>
      ctx.employmentType === "intern" && ctx.isAcademicInternship === true,
  },
  {
    type: "nda",
    category: "employment_contracts",
    phase: "first_day",
    priority: "required",
    appliesTo: () => true,
  },
  {
    type: "non_compete",
    category: "employment_contracts",
    phase: "first_day",
    priority: "required",
    appliesTo: ctx =>
      ctx.employmentType === "full_time" || ctx.employmentType === "intern",
  },
  {
    type: "acceptable_use_policy",
    category: "government_compliance",
    phase: "first_day",
    priority: "required",
    appliesTo: () => true,
  },
]

function mergeRequirements(rules: DocumentRequirementRule[]): DocumentRequirement[] {
  const merged = new Map<string, DocumentRequirement>()

  for (const rule of rules) {
    const key = `${rule.type}:${rule.phase}`
    const existing = merged.get(key)
    const minCount = rule.minCount ?? 1
    if (existing) {
      existing.minCount = Math.max(existing.minCount, minCount)
      if (rule.priority === "required") existing.priority = "required"
    } else {
      merged.set(key, {
        type: rule.type,
        label: DOCUMENT_TYPE_LABELS[rule.type],
        category: rule.category,
        categoryLabel: DOCUMENT_CATEGORY_LABELS[rule.category],
        phase: rule.phase,
        priority: rule.priority,
        minCount,
      })
    }
  }

  return Array.from(merged.values())
}

export function getApplicableRequirements(
  ctx: DocumentRequirementContext
): DocumentRequirement[] {
  const applicable = DOCUMENT_RULES.filter(rule => rule.appliesTo(ctx))
  return mergeRequirements(applicable)
}

export function getRequirementsForPhase(
  ctx: DocumentRequirementContext,
  phase: DocumentPhase
): DocumentRequirement[] {
  return getApplicableRequirements(ctx).filter(r => r.phase === phase)
}

export function getUploadRequirementsForPortal(
  ctx: DocumentRequirementContext
): DocumentRequirement[] {
  return getApplicableRequirements(ctx).filter(
    r =>
      r.phase === "pre_employment" ||
      r.phase === "before_start"
  )
}

export function getContractSigningRequirements(
  ctx: DocumentRequirementContext
): DocumentRequirement[] {
  return getRequirementsForPhase(ctx, "contract_signing")
}

export function getFirstDayRequirements(
  ctx: DocumentRequirementContext
): DocumentRequirement[] {
  return getRequirementsForPhase(ctx, "first_day")
}

export function contractTypeFromDocumentType(
  type: DocumentType
): ContractType | undefined {
  if (type === "job_offer") return "job_offer"
  if (type === "employment_contract") return "employment_contract"
  if (type === "moa") return "moa"
  return undefined
}

export function getRequiredContractTypes(
  ctx: DocumentRequirementContext
): ContractType[] {
  return getContractSigningRequirements(ctx)
    .filter(r => r.priority === "required")
    .map(r => contractTypeFromDocumentType(r.type))
    .filter((t): t is ContractType => t !== undefined)
}

export interface UploadedDocumentRef {
  type: DocumentType
  fileName?: string
  uploadedAt?: string
}

export interface UploadValidationResult {
  valid: boolean
  missing: DocumentRequirement[]
  errors: string[]
}

export function countUploadsByType(
  uploads: UploadedDocumentRef[],
  type: DocumentType
): number {
  return uploads.filter(u => u.type === type).length
}

export function validateRequiredUploads(
  ctx: DocumentRequirementContext,
  uploads: UploadedDocumentRef[],
  phases: DocumentPhase[] = ["pre_employment", "before_start"]
): UploadValidationResult {
  const requirements = getApplicableRequirements(ctx).filter(
    r => phases.includes(r.phase) && r.priority === "required"
  )
  const missing: DocumentRequirement[] = []
  const errors: string[] = []

  for (const req of requirements) {
    const count = countUploadsByType(uploads, req.type)
    if (count < req.minCount) {
      missing.push(req)
      const label =
        req.minCount > 1
          ? `${req.label} (${count}/${req.minCount})`
          : req.label
      errors.push(`${label} is required`)
    }
  }

  return { valid: missing.length === 0, missing, errors }
}

export interface ContractSignatureRef {
  contractType: ContractType
}

export function validateContractSignatures(
  ctx: DocumentRequirementContext,
  signatures: ContractSignatureRef[]
): UploadValidationResult {
  const required = getRequiredContractTypes(ctx)
  const signed = new Set(signatures.map(s => s.contractType))
  const missingTypes = required.filter(t => !signed.has(t))
  const missing = getContractSigningRequirements(ctx).filter(
    r =>
      r.priority === "required" &&
      missingTypes.includes(contractTypeFromDocumentType(r.type)!)
  )
  const errors = missing.map(r => `${r.label} must be signed`)

  return { valid: missing.length === 0, missing, errors }
}

export function deriveChecklistFromPolicy(
  documents: EmployeeDocument[],
  ctx: DocumentRequirementContext,
  compliance?: {
    ndaSignedAt?: string
    nonCompeteSignedAt?: string
    acceptableUseSignedAt?: string
    privacyConsentSigned?: boolean
    privacyConsentAt?: string
  }
): ChecklistItem[] {
  const requirements = getApplicableRequirements(ctx).filter(
    r => r.phase !== "hr_countersign"
  )
  const now = new Date()
  const docsByType = new Map<DocumentType, EmployeeDocument[]>()

  for (const doc of documents) {
    const list = docsByType.get(doc.type) ?? []
    list.push(doc)
    docsByType.set(doc.type, list)
  }

  const items: ChecklistItem[] = requirements.map(req => {
    let status: ChecklistItem["status"] = "pending"
    let completedAt: string | undefined

    if (req.phase === "first_day") {
      if (req.type === "nda" && compliance?.ndaSignedAt) {
        status = "complete"
        completedAt = compliance.ndaSignedAt
      } else if (req.type === "non_compete" && compliance?.nonCompeteSignedAt) {
        status = "complete"
        completedAt = compliance.nonCompeteSignedAt
      } else if (
        req.type === "acceptable_use_policy" &&
        compliance?.acceptableUseSignedAt
      ) {
        status = "complete"
        completedAt = compliance.acceptableUseSignedAt
      }
    } else {
      const docs = docsByType.get(req.type) ?? []
      const completeCount = docs.filter(
        d => !d.expiryDate || new Date(d.expiryDate) >= now
      ).length
      const expired = docs.some(
        d => d.expiryDate && new Date(d.expiryDate) < now
      )

      if (completeCount >= req.minCount) {
        status = "complete"
        completedAt = docs[0]?.uploadedAt ?? docs[0]?.signedAt
      } else if (expired) {
        status = "expired"
        completedAt = docs[0]?.uploadedAt
      }
    }

    return {
      key: req.type,
      label: req.label,
      status,
      completedAt,
      category: req.category,
      phase: req.phase,
      priority: req.priority,
    }
  })

  if (needsFirstDayWelcome(ctx)) {
    items.push({
      key: "other",
      label: "Privacy Notice / Data Privacy Consent",
      status: compliance?.privacyConsentSigned ? "complete" : "pending",
      completedAt: compliance?.privacyConsentAt,
      category: "government_compliance",
      phase: "first_day",
      priority: "required",
    })
  }

  const requiredItems = items.filter(i => i.priority === "required")
  const allComplete = requiredItems.every(i => i.status === "complete")
  items.push({
    key: "requirements_complete",
    label: "All requirements complete",
    status: allComplete ? "complete" : "pending",
  })

  return items
}

export function buildRequirementContextFromInvite(invite: {
  intendedEmploymentType?: EmploymentType
  intendedWorkLocation?: WorkLocation
  isAcademicInternship?: boolean
  candidatePayload?: { maritalStatus?: string }
}): DocumentRequirementContext {
  return {
    employmentType: invite.intendedEmploymentType ?? "full_time",
    workLocation: invite.intendedWorkLocation ?? "onsite",
    maritalStatus: invite.candidatePayload?.maritalStatus,
    isAcademicInternship: invite.isAcademicInternship,
  }
}

export function needsFirstDayWelcome(ctx: DocumentRequirementContext): boolean {
  return getFirstDayRequirements(ctx).some(r => r.priority === "required")
}
