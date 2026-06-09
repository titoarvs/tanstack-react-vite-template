import type { AuthUser } from "@/features/auth/types"
import {
  canViewEmployeeRecord,
  isDirectReport,
  isSelf,
} from "@/features/auth/accessPolicy"
import type { Employee } from "../types"
import { getFieldsForTab } from "./fieldRegistry"
import { EDM_ROLE_MATRIX } from "./roleMatrix"
import type {
  EdmFieldKey,
  EdmTab,
  FieldAccessContext,
  FieldAccessLevel,
  ResolvedFieldAccess,
} from "./types"

function buildContext(
  user: AuthUser,
  targetEmployeeId: string,
  employee?: Employee
): FieldAccessContext {
  const canViewRecord = canViewEmployeeRecord(user, targetEmployeeId, employee)
  return {
    viewerRole: user.role,
    isSelf: isSelf(user, targetEmployeeId),
    isDirectReport: Boolean(employee && isDirectReport(user, employee)),
    canViewRecord,
  }
}

function resolveLevel(
  matrixLevel: FieldAccessLevel,
  ctx: FieldAccessContext
): ResolvedFieldAccess {
  if (!ctx.canViewRecord) {
    return { level: "hidden", canView: false, canEdit: false }
  }

  switch (matrixLevel) {
    case "hidden":
      return { level: "hidden", canView: false, canEdit: false }

    case "view":
      return { level: "view", canView: true, canEdit: false }

    case "edit":
      return { level: "edit", canView: true, canEdit: true }

    case "limited_view":
      if (ctx.isSelf || ctx.isDirectReport) {
        return { level: "limited_view", canView: true, canEdit: false }
      }
      return { level: "hidden", canView: false, canEdit: false }

    case "view_own":
      if (ctx.isSelf) return { level: "view", canView: true, canEdit: false }
      if (ctx.isDirectReport) return { level: "view_team", canView: true, canEdit: false }
      if (
        ctx.viewerRole === "hris_admin" ||
        ctx.viewerRole === "hris_super_admin" ||
        ctx.viewerRole === "hrbp"
      ) {
        return { level: "view", canView: true, canEdit: false }
      }
      return { level: "hidden", canView: false, canEdit: false }

    case "edit_own":
      if (ctx.isSelf) return { level: "edit", canView: true, canEdit: true }
      if (ctx.isDirectReport) return { level: "limited_view", canView: true, canEdit: false }
      if (ctx.viewerRole === "hris_admin" || ctx.viewerRole === "hris_super_admin") {
        return { level: "edit", canView: true, canEdit: true }
      }
      if (ctx.viewerRole === "hrbp") {
        return { level: "view", canView: true, canEdit: false }
      }
      return { level: "hidden", canView: false, canEdit: false }

    case "view_team":
      if (ctx.isSelf || ctx.isDirectReport) {
        return { level: "view", canView: true, canEdit: false }
      }
      if (
        ctx.viewerRole === "hris_admin" ||
        ctx.viewerRole === "hris_super_admin" ||
        ctx.viewerRole === "hrbp" ||
        ctx.viewerRole === "system_admin"
      ) {
        return { level: "view", canView: true, canEdit: false }
      }
      return { level: "hidden", canView: false, canEdit: false }

    default:
      return { level: "hidden", canView: false, canEdit: false }
  }
}

export function resolveFieldAccess(
  user: AuthUser | null | undefined,
  fieldKey: EdmFieldKey,
  targetEmployeeId: string,
  employee?: Employee
): ResolvedFieldAccess {
  if (!user) return { level: "hidden", canView: false, canEdit: false }

  const ctx = buildContext(user, targetEmployeeId, employee)
  const matrixLevel = EDM_ROLE_MATRIX[fieldKey][user.role]
  return resolveLevel(matrixLevel, ctx)
}

export function canViewField(
  user: AuthUser | null | undefined,
  fieldKey: EdmFieldKey,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  return resolveFieldAccess(user, fieldKey, targetEmployeeId, employee).canView
}

export function canEditField(
  user: AuthUser | null | undefined,
  fieldKey: EdmFieldKey,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  return resolveFieldAccess(user, fieldKey, targetEmployeeId, employee).canEdit
}

/** Employment tab fields are editable by HRIS admins only. */
export function canEditEmploymentDetails(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  if (!user) return false
  if (user.role !== "hris_admin" && user.role !== "hris_super_admin") {
    return false
  }
  return canEditField(user, "departmentPosition", targetEmployeeId, employee)
}

export function getVisibleFieldsForTab(
  user: AuthUser | null | undefined,
  tab: EdmTab,
  targetEmployeeId: string,
  employee?: Employee
): EdmFieldKey[] {
  if (!user) return []
  return getFieldsForTab(tab)
    .map(f => f.key)
    .filter(key => canViewField(user, key, targetEmployeeId, employee))
}

export function canViewEdmTab(
  user: AuthUser | null | undefined,
  tab: EdmTab,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  return getVisibleFieldsForTab(user, tab, targetEmployeeId, employee).length > 0
}

/** Managers must not see compensation payroll runs per EDM spec */
export function canViewPayrollHistory(
  user: AuthUser | null | undefined,
  targetEmployeeId: string,
  employee?: Employee
): boolean {
  if (!user) return false
  if (isSelf(user, targetEmployeeId)) return true
  if (user.role === "hris_admin" || user.role === "hris_super_admin") return true
  if (user.role === "hrbp") return canViewField(user, "monthlySalary", targetEmployeeId, employee)
  return false
}
