import { useContext } from "react"
import { BillingContext } from "./billingContextState"

export function useBilling() {
  const ctx = useContext(BillingContext)
  if (!ctx) {
    throw new Error("useBilling must be used within BillingProvider")
  }
  return ctx
}
