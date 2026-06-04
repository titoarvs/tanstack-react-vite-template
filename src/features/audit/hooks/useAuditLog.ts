import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { resolveOrganizationId } from "@/features/billing/organization"
import { AUDIT_LOG_UPDATED_EVENT, getAuditEntries } from "../auditStorage"
import type { AuditCategoryFilter, AuditLogEntry } from "../types"

export function useAuditLog(filters?: {
  category?: AuditCategoryFilter
  search?: string
}) {
  const { user } = useAuth()
  const organizationId = user ? resolveOrganizationId(user) : null
  const [entries, setEntries] = useState<AuditLogEntry[]>([])

  const refresh = useCallback(() => {
    if (!organizationId) {
      setEntries([])
      return
    }
    setEntries(getAuditEntries(organizationId))
  }, [organizationId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener(AUDIT_LOG_UPDATED_EVENT, handler)
    return () => window.removeEventListener(AUDIT_LOG_UPDATED_EVENT, handler)
  }, [refresh])

  const filtered = useMemo(() => {
    let list = entries
    if (filters?.category && filters.category !== "all") {
      list = list.filter(e => e.category === filters.category)
    }
    const q = filters?.search?.trim().toLowerCase()
    if (q) {
      list = list.filter(
        e =>
          e.summary.toLowerCase().includes(q) ||
          e.actorName.toLowerCase().includes(q) ||
          e.actorEmail.toLowerCase().includes(q) ||
          e.pathname?.toLowerCase().includes(q)
      )
    }
    return list
  }, [entries, filters?.category, filters?.search])

  return { entries: filtered, total: entries.length, refresh, organizationId }
}
