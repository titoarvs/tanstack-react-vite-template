import { ClipboardList, UserPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ONBOARDING_STEP_COUNT } from "../lib/onboardingSteps"
import { useOnboardingDrafts } from "../hooks/useOnboardingDrafts"
import { useOnboardingPipelineCounts } from "../hooks/useOnboardingPipelineCounts"
import { OnboardingStatusTable } from "./OnboardingStatusTable"

interface OnboardingHubProps {
  onStartNew: (draftId: string) => void
  onResumeDraft: (draftId: string) => void
}

export function OnboardingHub({ onStartNew, onResumeDraft }: OnboardingHubProps) {
  const { createDraft } = useOnboardingDrafts()
  const { draftCount, pendingWelcomeCount, needsAttentionCount } =
    useOnboardingPipelineCounts()

  const handleStartNew = () => {
    const draft = createDraft()
    onStartNew(draft.id)
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/80 bg-card/80 shadow-sm sm:col-span-2">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Initiate onboarding
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {ONBOARDING_STEP_COUNT}-step HR wizard
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Start a new hire draft or resume from the table. After HR setup, employees sign
                in with their work email to finish welcome at /welcome.
              </p>
            </div>
            <Button type="button" size="lg" className="shrink-0" onClick={handleStartNew}>
              <UserPlus className="h-4 w-4" />
              Start onboarding
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="flex h-full flex-col justify-center gap-3 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Needs attention
              </span>
            </div>
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {needsAttentionCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {draftCount} HR draft{draftCount === 1 ? "" : "s"} · {pendingWelcomeCount} awaiting
              employee welcome
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center gap-3 border-b border-border/60 bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-success">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold">Onboarding status</CardTitle>
              <p className="text-xs text-muted-foreground">
                All directory employees plus in-progress HR drafts
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <OnboardingStatusTable onResumeDraft={onResumeDraft} />
        </CardContent>
      </Card>
    </div>
  )
}
