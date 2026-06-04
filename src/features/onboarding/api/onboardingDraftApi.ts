import { resolveOrganizationId } from "@/features/billing/organization"
import { employeeStore } from "@/lib/mock/employeeStore"
import { requireSessionUser } from "@/features/auth/authErrors"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { onboardingDefaults } from "../schemas/onboardingSchema"
import {
  getOnboardingDraft,
  listOnboardingDrafts,
  listReservedEmployeeIds,
  removeOnboardingDraft,
  upsertOnboardingDraft,
} from "../storage/onboardingDraftStorage"
import type { OnboardingDraft } from "../types/onboardingDraft"

function requireOrgId(): string {
  const user = requireSessionUser()
  return resolveOrganizationId(user)
}

export function fetchOnboardingDrafts(): OnboardingDraft[] {
  return listOnboardingDrafts(requireOrgId())
}

export function fetchOnboardingDraft(draftId: string): OnboardingDraft | undefined {
  return getOnboardingDraft(requireOrgId(), draftId)
}

function suggestEmployeeIdForOrg(organizationId: string): string {
  return employeeStore.getNextEmployeeId(listReservedEmployeeIds(organizationId))
}

export function createOnboardingDraft(): OnboardingDraft {
  const organizationId = requireOrgId()
  const now = new Date().toISOString()
  const draft: OnboardingDraft = {
    id: crypto.randomUUID(),
    organizationId,
    status: "in_progress",
    createdAt: now,
    updatedAt: now,
    currentStep: 0,
    maxReachedStep: 0,
    data: {
      ...onboardingDefaults,
      employeeId: suggestEmployeeIdForOrg(organizationId),
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      hireDate: new Date().toISOString().slice(0, 10),
    },
  }
  return upsertOnboardingDraft(draft)
}

export interface SaveOnboardingDraftInput {
  draftId: string
  currentStep: number
  maxReachedStep: number
  data: Partial<OnboardingFormData>
}

export function saveOnboardingDraft(input: SaveOnboardingDraftInput): OnboardingDraft {
  const organizationId = requireOrgId()
  const existing = getOnboardingDraft(organizationId, input.draftId)
  if (!existing) throw new Error("Onboarding draft not found")

  const draft: OnboardingDraft = {
    ...existing,
    currentStep: input.currentStep,
    maxReachedStep: Math.max(existing.maxReachedStep, input.maxReachedStep),
    data: { ...existing.data, ...input.data },
    updatedAt: new Date().toISOString(),
  }
  return upsertOnboardingDraft(draft)
}

export function deleteOnboardingDraft(draftId: string): void {
  removeOnboardingDraft(requireOrgId(), draftId)
}

export function regenerateDraftEmployeeId(draftId: string): OnboardingDraft {
  const organizationId = requireOrgId()
  const existing = getOnboardingDraft(organizationId, draftId)
  if (!existing) throw new Error("Onboarding draft not found")

  const reserved = listReservedEmployeeIds(organizationId).filter(
    id => id !== existing.data.employeeId
  )
  return saveOnboardingDraft({
    draftId,
    currentStep: existing.currentStep,
    maxReachedStep: existing.maxReachedStep,
    data: { ...existing.data, employeeId: employeeStore.getNextEmployeeId(reserved) },
  })
}
