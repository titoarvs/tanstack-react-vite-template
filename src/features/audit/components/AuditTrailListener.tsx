import { useRouterState } from "@tanstack/react-router"
import { useEffect } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { recordPageView } from "../auditLogger"

/** Records navigation events for the signed-in user */
export function AuditTrailListener() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    recordPageView(pathname, user)
  }, [pathname, user])

  return null
}
