import {
  FileText,
  ClipboardPen,
  ShieldCheck,
  UserRound,
  Phone,
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
    id: "documents",
    label: "Documents",
    shortLabel: "Documents",
    description: "Upload required pre-employment and government forms",
    icon: FileText,
  },
  {
    id: "contracts",
    label: "Contracts",
    shortLabel: "Contracts",
    description: "Review and electronically sign employment contracts",
    icon: ClipboardPen,
  },
  {
    id: "policies",
    label: "Policies & photo",
    shortLabel: "Policies",
    description: "Employee handbook acknowledgement and optional profile photo",
    icon: ShieldCheck,
  },
  {
    id: "review",
    label: "Review & submit",
    shortLabel: "Review",
    description: "Confirm your details before HR review",
    icon: FileText,
  },
]

export const PRE_EMPLOYMENT_STEP_COUNT = PRE_EMPLOYMENT_STEPS.length
