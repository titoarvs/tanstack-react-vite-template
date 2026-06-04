import { Briefcase, ClipboardCheck, UserRound, type LucideIcon } from "lucide-react"

export interface OnboardingStepDef {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  {
    id: "personal",
    label: "Personal information",
    shortLabel: "Personal",
    description: "Identity, contact details, and profile photo",
    icon: UserRound,
  },
  {
    id: "employment",
    label: "Employment details",
    shortLabel: "Employment",
    description: "Role, department, manager, and dates",
    icon: Briefcase,
  },
  {
    id: "review",
    label: "Review & submit",
    shortLabel: "Review",
    description: "Confirm everything before creating the record",
    icon: ClipboardCheck,
  },
]

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEPS.length
