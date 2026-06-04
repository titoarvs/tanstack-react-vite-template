import { useMemo } from "react"
import { useEmployees } from "@/features/employees/hooks/useEmployees"
import { countNeedsAttention } from "../lib/onboardingStatus"
import { useOnboardingDrafts } from "./useOnboardingDrafts"

export function useOnboardingPipelineCounts() {
  const { drafts } = useOnboardingDrafts()
  const { data: employees = [] } = useEmployees()

  return useMemo(
    () => ({
      draftCount: drafts.length,
      pendingWelcomeCount: employees.filter(e => e.profileOnboardingComplete !== true)
        .length,
      needsAttentionCount: countNeedsAttention(drafts, employees),
    }),
    [drafts, employees]
  )
}
