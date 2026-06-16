import {
  ClipboardCheck,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import type { Employee } from "@/features/employees/types"
import { isPreEmploymentWelcomePath } from "./profileOnboardingPolicy"

export interface ProfileOnboardingStepDef {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

const CONTACT_STEP: ProfileOnboardingStepDef = {
  id: "contact",
  label: "Contact & personal",
  shortLabel: "Contact",
  description: "Confirm how we can reach you and optional personal details",
  icon: UserRound,
}

const POLICIES_STEP: ProfileOnboardingStepDef = {
  id: "policies",
  label: "Policies & profile",
  shortLabel: "Policies",
  description: "Required acknowledgements and optional profile extras",
  icon: ShieldCheck,
}

const COMPLIANCE_STEP: ProfileOnboardingStepDef = {
  id: "compliance",
  label: "Compliance & contracts",
  shortLabel: "Compliance",
  description: "First-day cybersecurity acknowledgements",
  icon: ShieldCheck,
}

const REVIEW_STEP: ProfileOnboardingStepDef = {
  id: "review",
  label: "Review & finish",
  shortLabel: "Review",
  description: "Confirm your details before accessing the workspace",
  icon: ClipboardCheck,
}

export function getProfileOnboardingSteps(
  employee: Employee
): ProfileOnboardingStepDef[] {
  if (isPreEmploymentWelcomePath(employee)) {
    return [COMPLIANCE_STEP, REVIEW_STEP]
  }
  return [CONTACT_STEP, POLICIES_STEP, COMPLIANCE_STEP, REVIEW_STEP]
}

export const PROFILE_ONBOARDING_STEPS = [
  CONTACT_STEP,
  POLICIES_STEP,
  COMPLIANCE_STEP,
  REVIEW_STEP,
]

export function getProfileOnboardingStepCount(employee: Employee): number {
  return getProfileOnboardingSteps(employee).length
}
