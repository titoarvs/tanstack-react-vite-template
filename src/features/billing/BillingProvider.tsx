import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { employeeStore } from "@/lib/mock/employeeStore"
import {
  mockCancelAtPeriodEnd,
  mockChangePlan,
  mockReactivate,
  mockSubscribe,
} from "./api/mockBillingApi"
import { BillingContext } from "./billingContextState"
import { isDemoOrganization, resolveOrganizationId, resolveOrganizationName } from "./organization"
import { ensureSubscriptionForOrg } from "./subscriptionStorage"
import {
  canAddSeat as policyCanAddSeat,
  getTrialDaysRemaining,
  hasSubscriptionFeature,
  isSubscriptionUsable,
} from "./subscriptionPolicy"
import type { BillingInterval, PlanId } from "./types"
import type { OrganizationSubscription } from "./types"

export function BillingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null)
  const [seatCount, setSeatCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const organizationId = user ? resolveOrganizationId(user) : null
  const organizationName = user ? resolveOrganizationName(user) : null

  const load = useCallback(async () => {
    if (!user || !organizationId || !organizationName) {
      setSubscription(null)
      setSeatCount(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const sub = ensureSubscriptionForOrg(organizationId, organizationName, {
      demo: isDemoOrganization(organizationId),
    })
    const employees = await employeeStore.list()
    setSubscription(sub)
    setSeatCount(employees.length)
    setIsLoading(false)
  }, [user, organizationId, organizationName])

  useEffect(() => {
    void load()
  }, [load])

  const subscribe = useCallback(
    async (planId: PlanId, interval: BillingInterval) => {
      if (!organizationId || !organizationName) return
      const sub = await mockSubscribe(organizationId, organizationName, {
        planId,
        billingInterval: interval,
      })
      setSubscription(sub)
    },
    [organizationId, organizationName]
  )

  const changePlan = useCallback(
    async (planId: PlanId) => {
      if (!organizationId) return
      const sub = await mockChangePlan(organizationId, planId)
      setSubscription(sub)
    },
    [organizationId]
  )

  const cancelAtPeriodEnd = useCallback(async () => {
    if (!organizationId) return
    const sub = await mockCancelAtPeriodEnd(organizationId)
    setSubscription(sub)
  }, [organizationId])

  const reactivate = useCallback(async () => {
    if (!organizationId) return
    const sub = await mockReactivate(organizationId)
    setSubscription(sub)
  }, [organizationId])

  const value = useMemo(
    () => ({
      subscription,
      organizationId,
      organizationName,
      isLoading,
      isUsable: isSubscriptionUsable(subscription),
      seatCount,
      canAddSeat: policyCanAddSeat(subscription, seatCount),
      trialDaysRemaining: getTrialDaysRemaining(subscription),
      hasFeature: (feature: import("./types").SubscriptionFeature) =>
        hasSubscriptionFeature(subscription, feature),
      planId: subscription?.planId ?? null,
      refresh: () => {
        void load()
      },
      subscribe,
      changePlan,
      cancelAtPeriodEnd,
      reactivate,
    }),
    [
      subscription,
      organizationId,
      organizationName,
      isLoading,
      seatCount,
      load,
      subscribe,
      changePlan,
      cancelAtPeriodEnd,
      reactivate,
    ]
  )

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
}
