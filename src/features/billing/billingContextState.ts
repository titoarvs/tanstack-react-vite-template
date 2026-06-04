import { createContext } from "react"
import type { OrganizationSubscription, PlanId, SubscriptionFeature } from "./types"

export interface BillingContextValue {
  subscription: OrganizationSubscription | null
  organizationId: string | null
  organizationName: string | null
  isLoading: boolean
  isUsable: boolean
  seatCount: number
  canAddSeat: boolean
  trialDaysRemaining: number | null
  hasFeature: (feature: SubscriptionFeature) => boolean
  planId: PlanId | null
  refresh: () => void
  subscribe: (planId: PlanId, interval: import("./types").BillingInterval) => Promise<void>
  changePlan: (planId: PlanId) => Promise<void>
  cancelAtPeriodEnd: () => Promise<void>
  reactivate: () => Promise<void>
}

export const BillingContext = createContext<BillingContextValue | null>(null)
