import { TRIAL_DAYS, TRIAL_PLAN_ID, getPlan } from "./plans"
import type {
  BillingInterval,
  OrganizationSubscription,
  PlanId,
  SubscriptionStatus,
} from "./types"

const STORAGE_KEY = "titohris-org-subscriptions"

type SubscriptionMap = Record<string, OrganizationSubscription>

function readMap(): SubscriptionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as SubscriptionMap
  } catch {
    return {}
  }
}

function writeMap(map: SubscriptionMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function defaultPeriodEnd(from = new Date().toISOString()): string {
  return addDays(from, 30)
}

export function createTrialSubscription(
  organizationId: string,
  organizationName: string
): OrganizationSubscription {
  const now = new Date().toISOString()
  const plan = getPlan(TRIAL_PLAN_ID)
  return {
    organizationId,
    organizationName,
    planId: TRIAL_PLAN_ID,
    status: "trialing",
    billingInterval: "monthly",
    seatLimit: plan.seatLimit,
    trialEndsAt: addDays(now, TRIAL_DAYS),
    currentPeriodEnd: addDays(now, TRIAL_DAYS),
    updatedAt: now,
  }
}

export function createActiveSubscription(
  organizationId: string,
  organizationName: string,
  planId: PlanId,
  billingInterval: BillingInterval,
  status: SubscriptionStatus = "active"
): OrganizationSubscription {
  const now = new Date().toISOString()
  const plan = getPlan(planId)
  return {
    organizationId,
    organizationName,
    planId,
    status,
    billingInterval,
    seatLimit: plan.seatLimit,
    currentPeriodEnd: defaultPeriodEnd(now),
    updatedAt: now,
  }
}

/** Demo workspace — enterprise, always active */
export function createDemoEnterpriseSubscription(
  organizationId: string,
  organizationName: string
): OrganizationSubscription {
  return createActiveSubscription(
    organizationId,
    organizationName,
    "enterprise",
    "annual",
    "active"
  )
}

export function getSubscription(
  organizationId: string
): OrganizationSubscription | null {
  const map = readMap()
  return map[organizationId] ?? null
}

export function saveSubscription(subscription: OrganizationSubscription) {
  const map = readMap()
  map[subscription.organizationId] = {
    ...subscription,
    updatedAt: new Date().toISOString(),
  }
  writeMap(map)
}

export function ensureSubscriptionForOrg(
  organizationId: string,
  organizationName: string,
  options?: { demo?: boolean }
): OrganizationSubscription {
  const existing = getSubscription(organizationId)
  if (existing) return existing

  const subscription = options?.demo
    ? createDemoEnterpriseSubscription(organizationId, organizationName)
    : createTrialSubscription(organizationId, organizationName)

  saveSubscription(subscription)
  return subscription
}
