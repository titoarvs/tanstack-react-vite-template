import { useMemo } from "react"
import { useEmployees } from "@/features/employees/hooks/useEmployees"

export function useOnboardingPipelineCounts() {
  const { data: employees = [] } = useEmployees()

  return useMemo(
    () => ({
      draftCount: 0,
      pendingWelcomeCount: employees.filter(e => e.profileOnboardingComplete !== true)
        .length,
      needsAttentionCount: employees.filter(e => e.profileOnboardingComplete !== true)
        .length,
    }),
    [employees]
  )
}
