import type { AuditLogEntry } from "./types"

const STORAGE_KEY = "titohris-audit-log"
const MAX_ENTRIES_PER_ORG = 500

type AuditStore = Record<string, AuditLogEntry[]>

function readStore(): AuditStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === "object" ? (parsed as AuditStore) : {}
  } catch {
    return {}
  }
}

function writeStore(store: AuditStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export const AUDIT_LOG_UPDATED_EVENT = "titohris-audit-log-updated"

function notifyUpdated() {
  window.dispatchEvent(new CustomEvent(AUDIT_LOG_UPDATED_EVENT))
}

export function getAuditEntries(organizationId: string): AuditLogEntry[] {
  const store = readStore()
  return (store[organizationId] ?? []).slice().sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function getAuditEntryById(
  organizationId: string,
  entryId: string
): AuditLogEntry | undefined {
  return getAuditEntries(organizationId).find(e => e.id === entryId)
}

export function appendAuditEntry(organizationId: string, entry: AuditLogEntry) {
  const store = readStore()
  const list = store[organizationId] ?? []
  const next = [entry, ...list].slice(0, MAX_ENTRIES_PER_ORG)
  store[organizationId] = next
  writeStore(store)
  notifyUpdated()
}

export function clearAuditEntries(organizationId: string) {
  const store = readStore()
  delete store[organizationId]
  writeStore(store)
  notifyUpdated()
}
