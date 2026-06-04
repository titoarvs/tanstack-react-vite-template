import type { BillingInterval, PlanId, SubscriptionFeature } from "./types"

export interface PlanDefinition {
  id: PlanId
  name: string
  tagline: string
  /** Price per seat in USD (mock) — displayed, not charged */
  monthlyPricePerSeat: number
  annualPricePerSeat: number
  seatLimit: number
  features: readonly SubscriptionFeature[]
  highlighted?: boolean
  featureBullets: readonly string[]
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: "starter",
    name: "Starter",
    tagline: "Small teams getting started with HRIS",
    monthlyPricePerSeat: 6,
    annualPricePerSeat: 5,
    seatLimit: 15,
    features: ["core_hr", "employee_onboarding"],
    featureBullets: [
      "Dashboard & employee directory",
      "Profile onboarding (up to 15 seats)",
      "Email support",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    tagline: "Scaling people teams with analytics",
    monthlyPricePerSeat: 12,
    annualPricePerSeat: 10,
    seatLimit: 75,
    highlighted: true,
    features: [
      "core_hr",
      "employee_onboarding",
      "people_analytics",
      "payroll_module",
      "compliance_module",
      "advanced_reports",
    ],
    featureBullets: [
      "Everything in Starter",
      "People analytics & advanced reports",
      "Payroll & compliance modules (preview)",
      "Up to 75 seats",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Full platform, security, and governance",
    monthlyPricePerSeat: 22,
    annualPricePerSeat: 18,
    seatLimit: 9999,
    features: [
      "core_hr",
      "employee_onboarding",
      "people_analytics",
      "payroll_module",
      "compliance_module",
      "advanced_reports",
      "user_management",
      "audit_log",
      "api_access",
    ],
    featureBullets: [
      "Everything in Growth",
      "Users & access, audit log, API",
      "Unlimited seats (fair use)",
      "Priority support",
    ],
  },
}

export const PLAN_ORDER: readonly PlanId[] = ["starter", "growth", "enterprise"]

export const TRIAL_PLAN_ID: PlanId = "growth"
export const TRIAL_DAYS = 14

export function getPlan(planId: PlanId): PlanDefinition {
  return PLANS[planId]
}

export function getDisplayPrice(
  planId: PlanId,
  interval: BillingInterval
): number {
  const plan = getPlan(planId)
  return interval === "annual" ? plan.annualPricePerSeat : plan.monthlyPricePerSeat
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function planIncludesFeature(
  planId: PlanId,
  feature: SubscriptionFeature
): boolean {
  return PLANS[planId].features.includes(feature)
}
