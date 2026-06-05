import { useMemo } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { PERMISSIONS } from "@/features/auth/permissions"
import { usePreEmploymentInvites } from "@/features/pre-employment/hooks/usePreEmployment"
import { useEmployees } from "@/features/employees/hooks/useEmployees"

export function useOnboardingPipelineCounts() {
  const { can } = useAuth()
  const canManagePreEmployment = can(PERMISSIONS.EMPLOYEES_CREATE)
  const { data: employees = [] } = useEmployees()
  const { data: invites = [] } = usePreEmploymentInvites(canManagePreEmployment)

  return useMemo(() => {
    const pendingWelcomeCount = employees.filter(
      e =>
        e.status === "onboarding" ||
        (e.profileOnboardingComplete !== true && !e.preEmploymentCompletedAt)
    ).length
    const awaitingPreEmploymentReview = invites.filter(i => i.status === "submitted").length
    const draftCount = invites.filter(i =>
      ["invited", "in_progress", "rejected"].includes(i.status)
    ).length

    return {
      draftCount,
      pendingWelcomeCount,
      awaitingPreEmploymentReview,
      needsAttentionCount: pendingWelcomeCount + awaitingPreEmploymentReview,
    }
  }, [employees, invites])
}
