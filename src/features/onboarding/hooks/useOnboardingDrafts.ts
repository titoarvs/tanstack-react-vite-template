import { useCallback, useSyncExternalStore } from "react"
import {
  createOnboardingDraft,
  deleteOnboardingDraft,
  fetchOnboardingDrafts,
  saveOnboardingDraft,
  type SaveOnboardingDraftInput,
} from "../api/onboardingDraftApi"
import type { OnboardingDraft } from "../types/onboardingDraft"

const CHANGE_EVENT = "titohris-onboarding-drafts-change"

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange()
  window.addEventListener(CHANGE_EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}

let cachedSnapshot: OnboardingDraft[] = []
let cachedSnapshotKey = ""

function getSnapshot(): OnboardingDraft[] {
  try {
    const next = fetchOnboardingDrafts()
    const key = JSON.stringify(next)
    if (key === cachedSnapshotKey) {
      return cachedSnapshot
    }
    cachedSnapshotKey = key
    cachedSnapshot = next
    return cachedSnapshot
  } catch {
    if (cachedSnapshotKey === "[]") return cachedSnapshot
    cachedSnapshotKey = "[]"
    cachedSnapshot = []
    return cachedSnapshot
  }
}

export function notifyOnboardingDraftsChanged() {
  cachedSnapshotKey = ""
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function useOnboardingDrafts() {
  const drafts = useSyncExternalStore(subscribe, getSnapshot, () => [])

  const createDraft = useCallback(() => {
    const draft = createOnboardingDraft()
    notifyOnboardingDraftsChanged()
    return draft
  }, [])

  const saveDraftQuiet = useCallback((input: SaveOnboardingDraftInput) => {
    return saveOnboardingDraft(input)
  }, [])

  const saveDraft = useCallback((input: SaveOnboardingDraftInput) => {
    const saved = saveOnboardingDraft(input)
    notifyOnboardingDraftsChanged()
    return saved
  }, [])

  const removeDraft = useCallback((draftId: string) => {
    deleteOnboardingDraft(draftId)
    notifyOnboardingDraftsChanged()
  }, [])

  return {
    drafts,
    count: drafts.length,
    createDraft,
    saveDraft,
    saveDraftQuiet,
    removeDraft,
  }
}
