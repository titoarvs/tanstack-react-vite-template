import { Link } from "@tanstack/react-router"
import { AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBilling } from "../useBilling"
import { getPlan } from "../plans"

export function SubscriptionBanner() {
  const { subscription, isUsable, trialDaysRemaining, isLoading } = useBilling()

  if (isLoading || !subscription) return null

  if (!isUsable) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm sm:px-6">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Your subscription is inactive. Renew to access the workspace.
        </p>
        <Button asChild size="sm" variant="destructive">
          <Link to="/billing">Manage billing</Link>
        </Button>
      </div>
    )
  }

  if (subscription.status === "trialing" && trialDaysRemaining != null) {
    const plan = getPlan(subscription.planId)
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent/50 px-4 py-2.5 text-sm sm:px-6">
        <p className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-success" />
          <span>
            <strong>{plan.name} trial</strong> — {trialDaysRemaining} day
            {trialDaysRemaining === 1 ? "" : "s"} left. Subscribe to keep your data.
          </span>
        </p>
        <Button asChild size="sm" variant="secondary">
          <Link to="/pricing">View plans</Link>
        </Button>
      </div>
    )
  }

  if (subscription.cancelAtPeriodEnd) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5 text-sm sm:px-6">
        <p className="text-muted-foreground">
          Subscription cancels at period end (
          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}).
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/billing">Reactivate</Link>
        </Button>
      </div>
    )
  }

  return null
}
