import type { Employee } from "@/features/employees/types"
import { getFullName } from "@/features/employees/types"
import type { OnboardingDraft } from "../types/onboardingDraft"
import { getDraftDisplayName } from "./onboardingDraftPresentation"

export type HrSetupStatus = "in_progress" | "complete"
export type EmployeeWelcomeStatus = "not_started" | "pending" | "complete" | "na"

export type OnboardingTableFilter = "all" | "needs_attention" | "complete"

export interface OnboardingDraftRow {
  kind: "draft"
  id: string
  draft: OnboardingDraft
}

export interface OnboardingEmployeeRow {
  kind: "employee"
  id: string
  employee: Employee
}

export type OnboardingTableRow = OnboardingDraftRow | OnboardingEmployeeRow

export function getHrSetupStatus(row: OnboardingTableRow): HrSetupStatus {
  if (row.kind === "draft") return "in_progress"
  return "complete"
}

export function getEmployeeWelcomeStatus(row: OnboardingTableRow): EmployeeWelcomeStatus {
  if (row.kind === "draft") return "na"
  if (row.employee.profileOnboardingComplete === true) return "complete"
  return "pending"
}

export function getRowUpdatedAt(row: OnboardingTableRow): string {
  if (row.kind === "draft") return row.draft.updatedAt
  return row.employee.profileOnboardingCompletedAt ?? row.employee.updatedAt
}

export function getRowDisplayName(row: OnboardingTableRow): string {
  if (row.kind === "draft") return getDraftDisplayName(row.draft)
  return getFullName(row.employee)
}

export function needsAttention(row: OnboardingTableRow): boolean {
  if (row.kind === "draft") return true
  return row.employee.profileOnboardingComplete !== true
}

export function isPipelineComplete(row: OnboardingTableRow): boolean {
  if (row.kind === "draft") return false
  return row.employee.profileOnboardingComplete === true
}

export function buildOnboardingTableRows(
  drafts: OnboardingDraft[],
  employees: Employee[]
): OnboardingTableRow[] {
  const draftRows: OnboardingDraftRow[] = drafts.map(draft => ({
    kind: "draft",
    id: `draft-${draft.id}`,
    draft,
  }))
  const employeeRows: OnboardingEmployeeRow[] = employees.map(employee => ({
    kind: "employee",
    id: `employee-${employee.id}`,
    employee,
  }))
  return [...draftRows, ...employeeRows]
}

export function filterOnboardingRows(
  rows: OnboardingTableRow[],
  filter: OnboardingTableFilter
): OnboardingTableRow[] {
  if (filter === "all") return rows
  if (filter === "needs_attention") return rows.filter(needsAttention)
  return rows.filter(isPipelineComplete)
}

export function countNeedsAttention(
  drafts: OnboardingDraft[],
  employees: Employee[]
): number {
  const pendingWelcome = employees.filter(e => e.profileOnboardingComplete !== true).length
  return drafts.length + pendingWelcome
}

export const HR_SETUP_LABELS: Record<HrSetupStatus, string> = {
  in_progress: "In progress",
  complete: "Complete",
}

export const WELCOME_STATUS_LABELS: Record<EmployeeWelcomeStatus, string> = {
  not_started: "Not started",
  pending: "Pending",
  complete: "Complete",
  na: "—",
}
