import { Link, useParams } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { PRE_EMPLOYMENT_STEP_COUNT } from "../lib/preEmploymentSteps"
import { usePreEmploymentByToken } from "../hooks/usePreEmployment"
import { PreEmploymentWizard } from "../components/PreEmploymentWizard"

export function JoinPortalPage() {
  const { token } = useParams({ strict: false }) as { token: string }
  const { data: invite, isLoading, isError } = usePreEmploymentByToken(token ?? "")

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your invite…</p>
      </div>
    )
  }

  if (isError || !invite) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
        <p className="text-center text-sm text-muted-foreground">
          This invite link is invalid or has expired.
        </p>
        <Link to="/" className="mt-4 text-sm font-medium text-primary hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/">
            <TitoLogo size="md" />
          </Link>
          <span className="text-xs text-muted-foreground">Pre-employment onboarding</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-success" />
          {PRE_EMPLOYMENT_STEP_COUNT}-step pre-employment
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Complete your onboarding
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Submit your details for HR review. You will receive portal access after approval — not
          before.
        </p>

        <div className="mt-8">
          <PreEmploymentWizard invite={invite} token={token} />
        </div>
      </main>
    </div>
  )
}
