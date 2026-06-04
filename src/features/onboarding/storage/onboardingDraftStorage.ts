import type { OnboardingDraft } from "../types/onboardingDraft"

const STORAGE_KEY = "titohris-onboarding-drafts"

type DraftMap = Record<string, OnboardingDraft[]>

function readMap(): DraftMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as DraftMap
  } catch {
    return {}
  }
}

function writeMap(map: DraftMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function listOnboardingDrafts(organizationId: string): OnboardingDraft[] {
  const drafts = readMap()[organizationId] ?? []
  return [...drafts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getOnboardingDraft(
  organizationId: string,
  draftId: string
): OnboardingDraft | undefined {
  return listOnboardingDrafts(organizationId).find(d => d.id === draftId)
}

export function upsertOnboardingDraft(draft: OnboardingDraft): OnboardingDraft {
  const map = readMap()
  const orgDrafts = map[draft.organizationId] ?? []
  const index = orgDrafts.findIndex(d => d.id === draft.id)
  const next = { ...draft, updatedAt: new Date().toISOString() }
  if (index >= 0) {
    orgDrafts[index] = next
  } else {
    orgDrafts.push(next)
  }
  map[draft.organizationId] = orgDrafts
  writeMap(map)
  return next
}

export function removeOnboardingDraft(organizationId: string, draftId: string): void {
  const map = readMap()
  const orgDrafts = map[organizationId] ?? []
  map[organizationId] = orgDrafts.filter(d => d.id !== draftId)
  writeMap(map)
}

export function listReservedEmployeeIds(organizationId: string): string[] {
  return listOnboardingDrafts(organizationId)
    .map(d => d.data.employeeId?.trim())
    .filter((id): id is string => Boolean(id))
}
