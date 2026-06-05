import { Link } from "@tanstack/react-router"
import { ChevronLeft, Sparkles } from "lucide-react"
import { PageContent } from "@/components/layout/PageContent"
import { OnboardingWizard } from "../components/OnboardingWizard"
import { ONBOARDING_STEP_COUNT } from "../lib/onboardingSteps"

export function OnboardingPage() {
  return (
    <PageContent className="bg-container">
      <div className="relative mx-auto max-w-6xl">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--success) 12%, transparent) 0%, transparent 40%), radial-gradient(circle at 0% 100%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 35%)",
          }}
        />

        <Link
          to="/employees/directory"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to directory
        </Link>

        <header className="mb-6 sm:mb-8">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-success" />
            {ONBOARDING_STEP_COUNT}-step wizard
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Express hire
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Directly create an employee record when pre-employment data was collected offline.
            New hires still complete welcome onboarding before HRIS access. Prefer{" "}
            <Link to="/employees/pre-employment" className="font-medium text-primary hover:underline">
              pre-employment invites
            </Link>{" "}
            for the standard flow.
          </p>
        </header>

        <OnboardingWizard />
      </div>
    </PageContent>
  )
}
