import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { resolveOrganizationId } from "@/features/billing/organization"
import {
  AUDIT_LOG_UPDATED_EVENT,
  getAuditEntryById,
} from "../auditStorage"
import type { AuditLogEntry } from "../types"

export function useAuditEntry(entryId: string | undefined) {
  const { user } = useAuth()
  const organizationId = user ? resolveOrganizationId(user) : null
  const [entry, setEntry] = useState<AuditLogEntry | undefined>(undefined)

  const refresh = useCallback(() => {
    if (!organizationId || !entryId) {
      setEntry(undefined)
      return
    }
    setEntry(getAuditEntryById(organizationId, entryId))
  }, [organizationId, entryId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener(AUDIT_LOG_UPDATED_EVENT, handler)
    return () => window.removeEventListener(AUDIT_LOG_UPDATED_EVENT, handler)
  }, [refresh])

  return { entry, organizationId, refresh }
}
