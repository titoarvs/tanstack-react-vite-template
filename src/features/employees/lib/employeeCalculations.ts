import type { Employee, Gender } from "../types"
import type { MasterEmploymentType, MasterEmployeeStatus } from "../data/masterData"
import {
  PROBATION_MONTHS_DEFAULT,
  RETENTION_YEARS_DEFAULT,
} from "../data/masterData"
import type { ChecklistItem, EmployeeDocument } from "../types/documents"
import {
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
} from "../types/documents"

type LegacyEmploymentType = "full-time" | "internship" | "contract"

function mapLegacyEmploymentType(value: unknown): MasterEmploymentType {
  const v = String(value ?? "regular")
  if (v === "full-time") return "regular"
  if (v === "internship") return "internship"
  if (v === "contract") return "contract"
  if (
    v === "regular" ||
    v === "probationary" ||
    v === "consultant" ||
    v === "internship" ||
    v === "contract"
  ) {
    return v
  }
  return "regular"
}

function mapLegacyStatus(value: unknown): MasterEmployeeStatus {
  const v = String(value ?? "active")
  if (v === "inactive") return "inactive"
  if (
    v === "active" ||
    v === "on_leave" ||
    v === "resigned" ||
    v === "terminated" ||
    v === "inactive"
  ) {
    return v
  }
  return "active"
}

/** Ensure nested EDM groups exist on flat or partial employee records */
export function normalizeEmployee(raw: Employee): Employee {
  const employmentType = mapLegacyEmploymentType(
    raw.employmentType ?? (raw as { employmentType?: LegacyEmploymentType }).employmentType
  )
  const status = mapLegacyStatus(raw.status)

  return {
    ...raw,
    middleName: raw.middleName,
    suffix: raw.suffix,
    employmentType,
    status,
    contact: {
      ...raw.contact,
      province: raw.contact.province,
    },
    orgLevel: raw.orgLevel,
    businessUnit: raw.businessUnit,
    costCenter: raw.costCenter,
    workLocation: raw.workLocation ?? inferWorkLocation(raw.officeBranch),
    contractSignedDate: raw.contractSignedDate,
    separationReason: raw.separationReason,
    compensation: raw.compensation ?? {},
    governmentIds: raw.governmentIds ?? {},
    compliance: {
      retentionPeriodYears:
        raw.compliance?.retentionPeriodYears ?? RETENTION_YEARS_DEFAULT,
      ...raw.compliance,
      dataDeletionDate:
        raw.compliance?.dataDeletionDate ??
        computeDataDeletionDate(raw.lifecycle.terminationDate, RETENTION_YEARS_DEFAULT),
    },
    systemAccess: raw.systemAccess ?? { systems: [] },
    documents: raw.documents ?? [],
    onboardingChecklist:
      raw.onboardingChecklist ??
      deriveChecklistStatus(raw.documents ?? []),
    audit: {
      createdBy: raw.audit?.createdBy ?? "system",
      updatedBy: raw.audit?.updatedBy ?? "system",
    },
    lifecycle: {
      ...raw.lifecycle,
      probationEndDate:
        raw.lifecycle.probationEndDate ??
        computeProbationEnd(raw.lifecycle.hireDate, PROBATION_MONTHS_DEFAULT),
    },
    regularizationDate:
      raw.regularizationDate ??
      computeRegularizationDate(
        raw.lifecycle.hireDate,
        raw.lifecycle.probationEndDate,
        PROBATION_MONTHS_DEFAULT
      ),
  }
}

function inferWorkLocation(officeBranch?: string): Employee["workLocation"] {
  if (!officeBranch) return "office"
  return "office"
}

export function computeProbationEnd(
  hireDate: string,
  probationMonths = PROBATION_MONTHS_DEFAULT
): string | undefined {
  if (!hireDate) return undefined
  const d = new Date(hireDate)
  if (Number.isNaN(d.getTime())) return undefined
  d.setMonth(d.getMonth() + probationMonths)
  return d.toISOString().slice(0, 10)
}

export function computeRegularizationDate(
  hireDate: string,
  probationEndDate?: string,
  probationMonths = PROBATION_MONTHS_DEFAULT
): string | undefined {
  if (probationEndDate) {
    const d = new Date(probationEndDate)
    if (!Number.isNaN(d.getTime())) {
      d.setDate(d.getDate() + 1)
      return d.toISOString().slice(0, 10)
    }
  }
  return computeProbationEnd(hireDate, probationMonths)
}

export function computeDataDeletionDate(
  terminationDate: string | undefined,
  retentionYears = RETENTION_YEARS_DEFAULT
): string | undefined {
  if (!terminationDate) return undefined
  const d = new Date(terminationDate)
  if (Number.isNaN(d.getTime())) return undefined
  d.setFullYear(d.getFullYear() + retentionYears)
  return d.toISOString().slice(0, 10)
}

export function deriveChecklistStatus(documents: EmployeeDocument[]): ChecklistItem[] {
  const byType = new Map(documents.map(d => [d.type, d]))
  const now = new Date()

  const items: ChecklistItem[] = REQUIRED_DOCUMENT_TYPES.map(type => {
    const doc = byType.get(type)
    if (!doc) {
      return {
        key: type,
        label: DOCUMENT_TYPE_LABELS[type],
        status: "pending",
      }
    }
    if (doc.expiryDate && new Date(doc.expiryDate) < now) {
      return {
        key: type,
        label: DOCUMENT_TYPE_LABELS[type],
        status: "expired",
        completedAt: doc.uploadedAt,
      }
    }
    return {
      key: type,
      label: DOCUMENT_TYPE_LABELS[type],
      status: "complete",
      completedAt: doc.uploadedAt,
    }
  })

  const allComplete = items.every(i => i.status === "complete")
  items.push({
    key: "requirements_complete",
    label: "All requirements complete",
    status: allComplete ? "complete" : "pending",
  })

  return items
}

export function toGender(value?: string): Gender | undefined {
  const allowed: Gender[] = ["male", "female", "other", "prefer-not-to-say"]
  return value && allowed.includes(value as Gender) ? (value as Gender) : undefined
}
