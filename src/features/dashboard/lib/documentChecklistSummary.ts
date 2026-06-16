import type { ChecklistItem } from "@/features/employees/types/documents"

export interface DocumentChecklistSummary {
  items: ChecklistItem[]
  required: ChecklistItem[]
  secondary: ChecklistItem[]
  pendingRequired: ChecklistItem[]
  expiredRequired: ChecklistItem[]
  completedRequiredCount: number
  totalRequired: number
  allRequiredComplete: boolean
  progressPercent: number
}

export function summarizeDocumentChecklist(
  checklist: ChecklistItem[] | undefined
): DocumentChecklistSummary {
  const items = (checklist ?? []).filter(i => i.key !== "requirements_complete")
  const required = items.filter(i => i.priority !== "secondary")
  const secondary = items.filter(i => i.priority === "secondary")
  const pendingRequired = required.filter(i => i.status !== "complete")
  const expiredRequired = required.filter(i => i.status === "expired")
  const completedRequiredCount = required.filter(i => i.status === "complete").length
  const totalRequired = required.length

  return {
    items,
    required,
    secondary,
    pendingRequired,
    expiredRequired,
    completedRequiredCount,
    totalRequired,
    allRequiredComplete: pendingRequired.length === 0,
    progressPercent:
      totalRequired > 0
        ? Math.round((completedRequiredCount / totalRequired) * 100)
        : 100,
  }
}
