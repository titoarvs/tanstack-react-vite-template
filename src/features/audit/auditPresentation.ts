import type { LucideIcon } from "lucide-react"
import {
  ArrowRightLeft,
  CreditCard,
  LogIn,
  Palette,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react"
import type { AuditAction, AuditCategory } from "./types"

export const AUDIT_CATEGORY_LABELS: Record<AuditCategory, string> = {
  navigation: "Navigation",
  auth: "Authentication",
  employee: "Employees",
  billing: "Billing",
  settings: "Settings",
  security: "Security",
  compliance: "Compliance",
}

export function getCategoryIcon(category: AuditCategory): LucideIcon {
  switch (category) {
    case "navigation":
      return ArrowRightLeft
    case "auth":
      return LogIn
    case "employee":
      return Users
    case "billing":
      return CreditCard
    case "settings":
      return Palette
    case "security":
      return ScrollText
    case "compliance":
      return ShieldCheck
    default:
      return ScrollText
  }
}

export function getCategoryAccentClass(category: AuditCategory): string {
  switch (category) {
    case "navigation":
      return "border-l-muted-foreground/50 bg-muted/20"
    case "auth":
      return "border-l-primary bg-primary/5"
    case "employee":
      return "border-l-success bg-success/5"
    case "billing":
      return "border-l-chart-2 bg-chart-2/5"
    case "settings":
      return "border-l-accent-foreground/30 bg-accent/30"
    case "security":
      return "border-l-destructive/60 bg-destructive/5"
    case "compliance":
      return "border-l-chart-3 bg-chart-3/5"
    default:
      return "border-l-border bg-card"
  }
}

export function formatAuditTimestamp(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })
  if (isToday) return `Today at ${time}`
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function groupEntriesByDate<T extends { timestamp: string }>(
  entries: T[]
): { label: string; entries: T[] }[] {
  const groups = new Map<string, T[]>()
  for (const entry of entries) {
    const label = new Date(entry.timestamp).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    const list = groups.get(label) ?? []
    list.push(entry)
    groups.set(label, list)
  }
  return [...groups.entries()].map(([label, groupEntries]) => ({
    label,
    entries: groupEntries,
  }))
}

export function getActionLabel(action: AuditAction): string {
  return action.replace(/\./g, " · ")
}
