import { Check } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatUsd, getDisplayPrice, type PlanDefinition } from "../plans"
import type { BillingInterval } from "../types"

interface PlanCardProps {
  plan: PlanDefinition
  interval: BillingInterval
  currentPlanId?: string | null
  ctaLabel?: string
  ctaTo?: string
  onSelect?: () => void
  compact?: boolean
}

export function PlanCard({
  plan,
  interval,
  currentPlanId,
  ctaLabel = "Choose plan",
  ctaTo,
  onSelect,
  compact = false,
}: PlanCardProps) {
  const price = getDisplayPrice(plan.id, interval)
  const isCurrent = currentPlanId === plan.id

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-colors sm:p-6",
        plan.highlighted
          ? "border-tito-green/50 ring-1 ring-tito-green/25"
          : "border-border/80"
      )}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tito-green px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tito-blue">
          Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{formatUsd(price)}</span>
        <span className="text-sm text-muted-foreground">/ seat / mo</span>
      </p>
      {interval === "annual" && (
        <p className="text-xs text-muted-foreground">Billed annually (mock)</p>
      )}
      {!compact && (
        <ul className="mt-5 flex-1 space-y-2">
          {plan.featureBullets.map(bullet => (
            <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        {isCurrent ? (
          <Button variant="secondary" className="w-full" disabled>
            Current plan
          </Button>
        ) : ctaTo ? (
          <Button
            asChild
            className={cn("w-full", plan.highlighted && "bg-tito-blue hover:bg-tito-blue/90")}
            variant={plan.highlighted ? "default" : "outline"}
          >
            <Link to={ctaTo} search={{ plan: plan.id, interval }}>
              {ctaLabel}
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            className={cn("w-full", plan.highlighted && "bg-tito-blue hover:bg-tito-blue/90")}
            variant={plan.highlighted ? "default" : "outline"}
            onClick={onSelect}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </article>
  )
}
