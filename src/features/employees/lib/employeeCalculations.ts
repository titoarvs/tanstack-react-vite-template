import type { Employee, Gender } from "../types"
import { normalizeContactAddress } from "./address"
import type {
  MasterEmploymentType,
  MasterEmployeeStatus,
} from "../data/masterData"
import {
  PROBATION_MONTHS_DEFAULT,
  RETENTION_YEARS_DEFAULT,
} from "../data/masterData"
import type { ChecklistItem, EmployeeDocument } from "../types/documents"
import {
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
} from "../types/documents"

type LegacyEmploymentType =
  | "full-time"
  | "internship"
  | "contract"
  | "regular"
  | "probationary"
  | "consultant"

function mapLegacyEmploymentType(value: unknown): MasterEmploymentType {
  const v = String(value ?? "full_time")
  if (
    v === "full-time" ||
    v === "regular" ||
    v === "probationary" ||
    v === "consultant"
  ) {
    return "full_time"
  }
  if (v === "internship" || v === "intern") return "intern"
  if (v === "contract" || v === "part_time" || v === "part-time")
    return "part_time"
  if (v === "full_time" || v === "part_time" || v === "intern") return v
  return "full_time"
}

function mapLegacyStatus(value: unknown): MasterEmployeeStatus {
  const v = String(value ?? "active")
  if (v === "on_leave" || v === "loa" || v === "awol" || v === "resigned")
    return "inactive"
  if (
    v === "active" ||
    v === "inactive" ||
    v === "terminated" ||
    v === "onboarding" ||
    v === "pre_hire"
  ) {
    return v
  }
  return "active"
}

function mapLegacyStatusDetail(
  status: MasterEmployeeStatus,
  raw: Employee
): Employee["statusDetail"] {
  if (raw.statusDetail) return raw.statusDetail
  const legacyStatus = String(raw.status ?? "")
  if (legacyStatus === "on_leave") return "on_leave"
  if (status === "active") {
    const legacyType = String(raw.employmentType ?? "")
    if (legacyType === "probationary") return "probationary"
    return "regular"
  }
  return undefined
}

function mapLegacyWorkLocation(
  value: unknown,
  officeBranch?: string
): Employee["workLocation"] {
  const v = String(value ?? "")
  if (v === "office") return "onsite"
  if (v === "onsite" || v === "hybrid" || v === "remote") return v
  if (officeBranch) return "onsite"
  return "onsite"
}

/** Ensure nested EDM groups exist on flat or partial employee records */
export function normalizeEmployee(raw: Employee): Employee {
  const employmentType = mapLegacyEmploymentType(
    raw.employmentType ??
      (raw as unknown as { employmentType?: LegacyEmploymentType })
        .employmentType
  )
  const status = mapLegacyStatus(raw.status)
  const statusDetail = mapLegacyStatusDetail(status, raw)
  const workLocation = mapLegacyWorkLocation(raw.workLocation, raw.officeBranch)
  const probationEndDate =
    raw.lifecycle.probationEndDate ??
    computeProbationEnd(raw.lifecycle.hireDate, PROBATION_MONTHS_DEFAULT)

  return {
    ...raw,
    middleName: raw.middleName,
    suffix: raw.suffix,
    jobTitle: raw.jobTitle ?? raw.position,
    isManager: raw.isManager ?? false,
    employmentType,
    status,
    statusDetail,
    workLocation,
    contractSignedDate: raw.contractSignedDate ?? raw.lifecycle.hireDate,
    contact: {
      ...raw.contact,
      address: normalizeContactAddress(raw.contact),
    },
    orgLevel: raw.orgLevel,
    businessUnit: raw.businessUnit,
    costCenter: raw.costCenter,
    separationReason: raw.separationReason,
    compensation: raw.compensation ?? {},
    governmentIds: raw.governmentIds ?? {},
    compliance: {
      retentionPeriodYears:
        raw.compliance?.retentionPeriodYears ?? RETENTION_YEARS_DEFAULT,
      ...raw.compliance,
      dataDeletionDate:
        raw.compliance?.dataDeletionDate ??
        computeDataDeletionDate(
          raw.lifecycle.terminationDate,
          RETENTION_YEARS_DEFAULT
        ),
    },
    systemAccess: raw.systemAccess ?? { systems: [] },
    documents: raw.documents ?? [],
    onboardingChecklist:
      raw.onboardingChecklist ?? deriveChecklistStatus(raw.documents ?? []),
    audit: {
      createdBy: raw.audit?.createdBy ?? "system",
      updatedBy: raw.audit?.updatedBy ?? "system",
    },
    lifecycle: {
      ...raw.lifecycle,
      probationEndDate,
    },
    regularizationDate:
      raw.regularizationDate ??
      computeRegularizationDate(
        raw.lifecycle.hireDate,
        probationEndDate,
        PROBATION_MONTHS_DEFAULT
      ),
  }
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

export function deriveChecklistStatus(
  documents: EmployeeDocument[]
): ChecklistItem[] {
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
  return value && allowed.includes(value as Gender)
    ? (value as Gender)
    : undefined
}
