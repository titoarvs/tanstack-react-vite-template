import { ClipboardCheck, ShieldCheck, UserRound, type LucideIcon } from "lucide-react"

export interface ProfileOnboardingStepDef {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export const PROFILE_ONBOARDING_STEPS: ProfileOnboardingStepDef[] = [
  {
    id: "contact",
    label: "Contact & personal",
    shortLabel: "Contact",
    description: "Confirm how we can reach you and optional personal details",
    icon: UserRound,
  },
  {
    id: "policies",
    label: "Policies & profile",
    shortLabel: "Policies",
    description: "Required acknowledgements and optional profile extras",
    icon: ShieldCheck,
  },
  {
    id: "review",
    label: "Review & finish",
    shortLabel: "Review",
    description: "Confirm your details before accessing the workspace",
    icon: ClipboardCheck,
  },
]

export const PROFILE_ONBOARDING_STEP_COUNT = PROFILE_ONBOARDING_STEPS.length
