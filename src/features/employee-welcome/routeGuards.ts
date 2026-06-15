import { redirect } from "@tanstack/react-router"
import { needsPrivacyConsent } from "@/features/compliance/lib/privacyConsentPolicy"
import { getSession } from "@/features/auth/authStorage"
import { getPostLoginPath, needsEmployeeWelcomeOnboarding } from "./lib/profileOnboardingPolicy"

export function requirePrivacyConsentAccess() {
  return () => {
    const user = getSession()
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/privacy-consent" } })
    }
    if (!needsPrivacyConsent(user)) {
      throw redirect({ to: getPostLoginPath(user) })
    }
  }
}

/** Block app shell and welcome until privacy notice is acknowledged. */
export function requirePrivacyConsentComplete({
  location,
}: {
  location: { pathname: string }
}) {
  const user = getSession()
  if (!user) return
  if (location.pathname.startsWith("/privacy-consent")) return
  if (needsPrivacyConsent(user)) {
    throw redirect({ to: "/privacy-consent" })
  }
}

export function requireWelcomeOnboardingAccess() {
  return () => {
    const user = getSession()
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/welcome" } })
    }
    if (needsPrivacyConsent(user)) {
      throw redirect({ to: "/privacy-consent" })
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
  if (location.pathname.startsWith("/privacy-consent")) return
  if (location.pathname.startsWith("/welcome")) return
  if (needsPrivacyConsent(user)) {
    throw redirect({ to: "/privacy-consent" })
  }
  if (needsEmployeeWelcomeOnboarding(user)) {
    throw redirect({ to: "/welcome" })
  }
}

export function redirectIfAuthenticatedToApp() {
  if (!getSession()) return
  const user = getSession()
  throw redirect({ to: getPostLoginPath(user) })
}
