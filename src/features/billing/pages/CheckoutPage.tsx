import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMISSIONS } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { formatUsd, getDisplayPrice, getPlan, PLAN_ORDER } from "../plans"
import { useBilling } from "../useBilling"
import type { BillingInterval, PlanId } from "../types"

function parsePlan(value: unknown): PlanId {
  if (typeof value === "string" && PLAN_ORDER.includes(value as PlanId)) {
    return value as PlanId
  }
  return "growth"
}

function parseInterval(value: unknown): BillingInterval {
  return value === "annual" ? "annual" : "monthly"
}

export function CheckoutPage() {
  const search = useSearch({ strict: false }) as {
    plan?: string
    interval?: string
  }
  const navigate = useNavigate()
  const { can } = useAuth()
  const { subscribe, organizationName, seatCount } = useBilling()
  const planId = parsePlan(search.plan)
  const interval = parseInterval(search.interval)
  const plan = getPlan(planId)
  const unitPrice = getDisplayPrice(planId, interval)
  const estimatedTotal = unitPrice * Math.max(seatCount, 1)
  const [submitting, setSubmitting] = useState(false)

  const canCheckout = can(PERMISSIONS.BILLING_MANAGE)

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await subscribe(planId, interval)
      navigate({ to: "/billing" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageContent className="max-w-lg">
      <PageHeader title="Confirm subscription" />
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">
        Mock checkout — no payment processor connected.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{plan.name} plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            {organizationName ?? "Your organization"} · {interval} billing
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Price per seat</dt>
              <dd className="font-medium">{formatUsd(unitPrice)}/mo</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Seats (current usage)</dt>
              <dd className="font-medium">{Math.max(seatCount, 1)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-medium text-foreground">Estimated total</dt>
              <dd className="font-bold">{formatUsd(estimatedTotal)}/mo</dd>
            </div>
          </dl>

          {!canCheckout && (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              Ask an HR Admin or Administrator to complete checkout for your organization.
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              disabled={submitting || !canCheckout}
              onClick={() => void handleConfirm()}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Confirm subscription
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/pricing">Change plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContent>
  )
}
