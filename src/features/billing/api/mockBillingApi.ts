import {
  recordBillingCancelScheduled,
  recordBillingPlanChanged,
  recordBillingReactivated,
  recordBillingSubscribed,
} from "@/features/audit/auditLogger"
import {
  createActiveSubscription,
  getSubscription,
  saveSubscription,
} from "../subscriptionStorage"
import { getPlan } from "../plans"
import type { BillingInterval, CheckoutSelection, PlanId } from "../types"

function delay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200))
}

export async function mockSubscribe(
  organizationId: string,
  organizationName: string,
  selection: CheckoutSelection
) {
  await delay(600)
  const subscription = createActiveSubscription(
    organizationId,
    organizationName,
    selection.planId,
    selection.billingInterval,
    "active"
  )
  saveSubscription(subscription)
  recordBillingSubscribed(selection.planId)
  return subscription
}

export async function mockChangePlan(
  organizationId: string,
  planId: PlanId,
  billingInterval?: BillingInterval
) {
  await delay(400)
  const current = getSubscription(organizationId)
  if (!current) throw new Error("No subscription")
  const plan = getPlan(planId)
  const updated = {
    ...current,
    planId,
    seatLimit: plan.seatLimit,
    billingInterval: billingInterval ?? current.billingInterval,
    status: "active" as const,
    trialEndsAt: undefined,
    cancelAtPeriodEnd: false,
    updatedAt: new Date().toISOString(),
  }
  saveSubscription(updated)
  recordBillingPlanChanged(planId)
  return updated
}

export async function mockCancelAtPeriodEnd(organizationId: string) {
  await delay(300)
  const current = getSubscription(organizationId)
  if (!current) throw new Error("No subscription")
  const updated = { ...current, cancelAtPeriodEnd: true }
  saveSubscription(updated)
  recordBillingCancelScheduled()
  return updated
}

export async function mockReactivate(organizationId: string) {
  await delay(300)
  const current = getSubscription(organizationId)
  if (!current) throw new Error("No subscription")
  const updated = {
    ...current,
    cancelAtPeriodEnd: false,
    status: "active" as const,
  }
  saveSubscription(updated)
  recordBillingReactivated()
  return updated
}
