import { redirect } from "@tanstack/react-router"
import { getSession } from "@/features/auth/authStorage"
import { getPostLoginPath, needsEmployeeWelcomeOnboarding } from "./lib/profileOnboardingPolicy"

export function requireWelcomeOnboardingAccess() {
  return () => {
    const user = getSession()
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/welcome" } })
    }
    if (!needsEmployeeWelcomeOnboarding(user)) {
      throw redirect({ to: "/dashboard" })
    }
  }
}

/** Block app shell until new employees finish welcome onboarding */
export function requireEmployeeWelcomeComplete({
  location,
}: {
  location: { pathname: string }
}) {
  const user = getSession()
  if (!user) return
  if (location.pathname.startsWith("/welcome")) return
  if (needsEmployeeWelcomeOnboarding(user)) {
    throw redirect({ to: "/welcome" })
  }
}

export function redirectIfAuthenticatedToApp() {
  if (!getSession()) return
  const user = getSession()
  throw redirect({ to: getPostLoginPath(user) })
}
