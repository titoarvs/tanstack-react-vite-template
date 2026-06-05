import {
  ClipboardCheck,
  Phone,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react"

export interface PreEmploymentStepDef {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}

export const PRE_EMPLOYMENT_STEPS: PreEmploymentStepDef[] = [
  {
    id: "contact",
    label: "Contact & address",
    shortLabel: "Contact",
    description: "How we can reach you and your home address",
    icon: UserRound,
  },
  {
    id: "emergency",
    label: "Emergency & personal",
    shortLabel: "Emergency",
    description: "Emergency contact and optional personal details",
    icon: Phone,
  },
  {
    id: "policies",
    label: "Policies & photo",
    shortLabel: "Policies",
    description: "Required acknowledgements and optional profile photo",
    icon: ShieldCheck,
  },
  {
    id: "review",
    label: "Review & submit",
    shortLabel: "Review",
    description: "Confirm your details before HR review",
    icon: ClipboardCheck,
  },
]

export const PRE_EMPLOYMENT_STEP_COUNT = PRE_EMPLOYMENT_STEPS.length
