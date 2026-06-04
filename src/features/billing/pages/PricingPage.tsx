import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PlanCard } from "../components/PlanCard"
import { PLAN_ORDER, PLANS } from "../plans"
import type { BillingInterval } from "../types"

export function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly")

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/">
            <TitoLogo size="md" />
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Start free trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            SaaS pricing
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plans that scale with your team
          </h1>
          <p className="mt-3 text-muted-foreground">
            Per-seat pricing. Every new workspace starts with a 14-day Growth trial — no card
            required in this mock preview.
          </p>
          <div className="mt-6 inline-flex rounded-lg border border-border p-1">
            {(["monthly", "annual"] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setInterval(opt)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors",
                  interval === opt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt}
                {opt === "annual" && (
                  <span className="ml-1.5 text-xs opacity-80">Save ~17%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLAN_ORDER.map(id => (
            <PlanCard
              key={id}
              plan={PLANS[id]}
              interval={interval}
              ctaLabel="Start trial"
              ctaTo="/login"
            />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Mock billing only — charges are not processed. Subscriptions are stored in your browser.
        </p>
      </main>
    </div>
  )
}
