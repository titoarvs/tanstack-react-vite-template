import { planIncludesFeature } from "./plans"
import type {
  OrganizationSubscription,
  PlanId,
  SubscriptionFeature,
  SubscriptionStatus,
} from "./types"

export function isSubscriptionUsable(
  subscription: OrganizationSubscription | null | undefined
): boolean {
  if (!subscription) return false
  if (subscription.status === "canceled" || subscription.status === "incomplete") {
    return false
  }
  if (subscription.status === "past_due") return false

  const now = Date.now()
  if (subscription.status === "trialing" && subscription.trialEndsAt) {
    return new Date(subscription.trialEndsAt).getTime() > now
  }

  return (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    new Date(subscription.currentPeriodEnd).getTime() > now
  )
}

export function hasSubscriptionFeature(
  subscription: OrganizationSubscription | null | undefined,
  feature: SubscriptionFeature
): boolean {
  if (!subscription || !isSubscriptionUsable(subscription)) return false
  return planIncludesFeature(subscription.planId, feature)
}

export function getTrialDaysRemaining(
  subscription: OrganizationSubscription | null | undefined
): number | null {
  if (!subscription?.trialEndsAt || subscription.status !== "trialing") return null
  const ms = new Date(subscription.trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

export function canAddSeat(
  subscription: OrganizationSubscription | null | undefined,
  currentSeatCount: number
): boolean {
  if (!isSubscriptionUsable(subscription) || !subscription) return false
  return currentSeatCount < subscription.seatLimit
}

export function comparePlans(a: PlanId, b: PlanId): number {
  const order: PlanId[] = ["starter", "growth", "enterprise"]
  return order.indexOf(a) - order.indexOf(b)
}

export function subscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "trialing":
      return "Trial"
    case "active":
      return "Active"
    case "past_due":
      return "Past due"
    case "canceled":
      return "Canceled"
    case "incomplete":
      return "Incomplete"
    default:
      return status
  }
}
