import { Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMISSIONS } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { PlanCard } from "../components/PlanCard"
import { SeatUsageMeter } from "../components/SeatUsageMeter"
import { PLAN_ORDER, getPlan } from "../plans"
import { subscriptionStatusLabel } from "../subscriptionPolicy"
import { useBilling } from "../useBilling"
import type { BillingInterval, PlanId } from "../types"

export function BillingPage() {
  const { can } = useAuth()
  const canManage = can(PERMISSIONS.BILLING_MANAGE)
  const {
    subscription,
    organizationName,
    seatCount,
    isLoading,
    changePlan,
    cancelAtPeriodEnd,
    reactivate,
    trialDaysRemaining,
  } = useBilling()
  const [interval, setInterval] = useState<BillingInterval>(
    subscription?.billingInterval ?? "monthly"
  )
  const [busy, setBusy] = useState(false)

  async function handleChangePlan(planId: PlanId) {
    if (!canManage) return
    setBusy(true)
    try {
      await changePlan(planId)
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel() {
    if (!canManage) return
    setBusy(true)
    try {
      await cancelAtPeriodEnd()
    } finally {
      setBusy(false)
    }
  }

  async function handleReactivate() {
    if (!canManage) return
    setBusy(true)
    try {
      await reactivate()
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) {
    return (
      <PageContent className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </PageContent>
    )
  }

  if (!subscription) {
    return (
      <PageContent>
        <p className="text-sm text-muted-foreground">No subscription found.</p>
      </PageContent>
    )
  }

  const plan = getPlan(subscription.planId)

  return (
    <PageContent className="max-w-4xl">
      <PageHeader title="Billing & subscription" />
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">
        Manage your organization plan, seats, and renewal (mock SaaS — stored locally).
      </p>

      <Card className="mb-6 border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{organizationName}</CardTitle>
            <Badge variant="secondary">{subscriptionStatusLabel(subscription.status)}</Badge>
            {subscription.cancelAtPeriodEnd && (
              <Badge variant="outline">Canceling</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Current plan</dt>
              <dd className="font-medium">{plan.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Billing</dt>
              <dd className="font-medium capitalize">{subscription.billingInterval}</dd>
            </div>
            {subscription.status === "trialing" && trialDaysRemaining != null && (
              <div>
                <dt className="text-muted-foreground">Trial ends</dt>
                <dd className="font-medium">
                  {trialDaysRemaining} days (
                  {subscription.trialEndsAt
                    ? new Date(subscription.trialEndsAt).toLocaleDateString()
                    : "—"}
                  )
                </dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Period ends</dt>
              <dd className="font-medium">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <SeatUsageMeter used={seatCount} limit={subscription.seatLimit} />
          {canManage && (
            <div className="flex flex-wrap gap-2 pt-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button size="sm" disabled={busy} onClick={() => void handleReactivate()}>
                  Reactivate subscription
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void handleCancel()}
                >
                  Cancel at period end
                </Button>
              )}
              <Button asChild size="sm" variant="secondary">
                <Link to="/pricing">Compare plans</Link>
              </Button>
            </div>
          )}
          {!canManage && (
            <p className="text-xs text-muted-foreground">
              Billing changes require HR Admin or Administrator access.
            </p>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Change plan</h2>
          <div className="mb-4 inline-flex rounded-lg border border-border p-1">
            {(["monthly", "annual"] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setInterval(opt)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
                  interval === opt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PLAN_ORDER.map(id => (
              <PlanCard
                key={id}
                plan={getPlan(id)}
                interval={interval}
                currentPlanId={subscription.planId}
                ctaLabel="Switch plan"
                onSelect={() => void handleChangePlan(id)}
                compact
              />
            ))}
          </div>
        </section>
      )}
    </PageContent>
  )
}
