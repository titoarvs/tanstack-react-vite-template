import type { UserRole } from "@/features/auth/types"

export type AuditCategory =
  | "navigation"
  | "auth"
  | "employee"
  | "billing"
  | "settings"
  | "security"

export type AuditAction =
  | "page.view"
  | "auth.login"
  | "auth.logout"
  | "employee.created"
  | "employee.deleted"
  | "employee.viewed"
  | "billing.subscribed"
  | "billing.plan_changed"
  | "billing.cancel_scheduled"
  | "billing.reactivated"
  | "settings.theme_changed"
  | "onboarding.completed"
  | "pre_employment.invited"
  | "pre_employment.submitted"
  | "pre_employment.approved"
  | "rbac.updated"

export interface AuditLogEntry {
  id: string
  timestamp: string
  organizationId: string
  actorId: string
  actorEmail: string
  actorName: string
  actorRole: UserRole
  category: AuditCategory
  action: AuditAction
  summary: string
  pathname?: string
  metadata?: Record<string, string>
}

export type AuditCategoryFilter = AuditCategory | "all"
