import { employeeStore } from "@/lib/mock/employeeStore"
import type { AuthUser } from "@/features/auth/types"
import type { Employee } from "@/features/employees/types"

export function getLinkedEmployee(user: AuthUser | null | undefined): Employee | undefined {
  if (!user?.employeeId) return undefined
  return employeeStore.getByIdSync(user.employeeId)
}

/** New hires (employee role) must finish welcome onboarding before the app shell */
export function needsEmployeeWelcomeOnboarding(
  user: AuthUser | null | undefined
): boolean {
  if (!user || user.role !== "employee" || !user.employeeId) return false
  const employee = getLinkedEmployee(user)
  if (!employee) return false
  return employee.profileOnboardingComplete !== true
}

export function getPostLoginPath(
  user: AuthUser | null | undefined,
  redirect?: string
): string {
  if (
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    redirect !== "/login" &&
    redirect !== "/welcome"
  ) {
    if (needsEmployeeWelcomeOnboarding(user)) return "/welcome"
    return redirect
  }
  if (needsEmployeeWelcomeOnboarding(user)) return "/welcome"
  return "/dashboard"
}
