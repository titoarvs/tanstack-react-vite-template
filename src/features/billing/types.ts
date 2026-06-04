export type PlanId = "starter" | "growth" | "enterprise"

export type BillingInterval = "monthly" | "annual"

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"

/** Product capability gated by plan (not RBAC role) */
export type SubscriptionFeature =
  | "core_hr"
  | "employee_onboarding"
  | "people_analytics"
  | "payroll_module"
  | "compliance_module"
  | "advanced_reports"
  | "user_management"
  | "audit_log"
  | "api_access"

export interface OrganizationSubscription {
  organizationId: string
  organizationName: string
  planId: PlanId
  status: SubscriptionStatus
  billingInterval: BillingInterval
  seatLimit: number
  /** ISO date — present while trialing */
  trialEndsAt?: string
  currentPeriodEnd: string
  cancelAtPeriodEnd?: boolean
  updatedAt: string
}

export interface CheckoutSelection {
  planId: PlanId
  billingInterval: BillingInterval
}
