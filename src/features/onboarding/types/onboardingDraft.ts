import type { OnboardingFormData } from "../schemas/onboardingSchema"

export type OnboardingDraftStatus = "in_progress"

export interface OnboardingDraft {
  id: string
  organizationId: string
  status: OnboardingDraftStatus
  createdAt: string
  updatedAt: string
  currentStep: number
  maxReachedStep: number
  data: Partial<OnboardingFormData>
}
