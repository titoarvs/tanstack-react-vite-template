import { createContext, useContext } from "react"

interface OnboardingWizardContextValue {
  regenerateEmployeeId: () => void
  isRegeneratingId: boolean
}

export const OnboardingWizardContext = createContext<OnboardingWizardContextValue | null>(
  null
)

export function useOnboardingWizardContext() {
  const ctx = useContext(OnboardingWizardContext)
  if (!ctx) {
    throw new Error("useOnboardingWizardContext must be used within OnboardingWizard")
  }
  return ctx
}
