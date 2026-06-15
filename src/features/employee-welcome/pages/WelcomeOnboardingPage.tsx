import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { PrivacyConsentDialog } from "@/features/compliance/components/PrivacyConsentDialog"
import { needsPrivacyConsent } from "@/features/compliance/lib/privacyConsentPolicy"
import { useAuth } from "@/features/auth/useAuth"
import {
  getLinkedEmployee,
  needsEmployeeWelcomeOnboarding,
} from "../lib/profileOnboardingPolicy"
import { ProfileOnboardingWizard } from "../components/ProfileOnboardingWizard"

export function WelcomeOnboardingPage() {
  const { user, requestLogout } = useAuth()
  const employee = getLinkedEmployee(user)
  const navigate = useNavigate()
  const [consentComplete, setConsentComplete] = useState(() => !needsPrivacyConsent(user))
  const showPrivacyConsent = !consentComplete && needsPrivacyConsent(user)

  const handleConsentComplete = () => {
    setConsentComplete(true)
    if (!needsEmployeeWelcomeOnboarding(user)) {
      navigate({ to: "/dashboard" })
    }
  }

  if (!employee) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
        <p className="text-center text-sm text-muted-foreground">
          No employee record is linked to your account. Please contact HR.
        </p>
        <button
          type="button"
          onClick={() => {
            requestLogout(() => navigate({ to: "/login" }))
          }}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Sign out
        </button>
      </div>
    )
  }

  if (showPrivacyConsent) {
    return (
      <div className="min-h-dvh bg-background">
        <header className="border-b border-dashed border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link to="/">
              <TitoLogo size="md" />
            </Link>
            <button
              type="button"
              onClick={() => {
                requestLogout(() => navigate({ to: "/login" }))
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </header>

        <PrivacyConsentDialog open onComplete={handleConsentComplete} />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 10%, color-mix(in oklch, var(--tito-green) 14%, transparent) 0%, transparent 45%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 40%)",
        }}
      />

      <header className="relative border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/">
            <TitoLogo size="md" />
          </Link>
          <button
            type="button"
            onClick={() => {
              requestLogout(() => navigate({ to: "/login" }))
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome to TitoHRIS
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Complete your profile before accessing the workspace. HR has already
          added your role — confirm your contact details and required policies
          below.
        </p>

        <div className="mt-8">
          <ProfileOnboardingWizard employee={employee} />
        </div>
      </main>
    </div>
  )
}
