import type { OnboardingDraft } from "../types/onboardingDraft"
import { ONBOARDING_STEPS } from "./onboardingSteps"

export function getDraftDisplayName(draft: OnboardingDraft): string {
  const first = draft.data.firstName?.trim() ?? ""
  const last = draft.data.lastName?.trim() ?? ""
  const name = `${first} ${last}`.trim()
  if (name) return name
  if (draft.data.email?.trim()) return draft.data.email.trim()
  if (draft.data.employeeId?.trim()) return draft.data.employeeId.trim()
  return "Untitled draft"
}

export function formatDraftUpdatedAt(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function getDraftStepLabel(stepIndex: number): string {
  return ONBOARDING_STEPS[stepIndex]?.shortLabel ?? "Personal"
}
