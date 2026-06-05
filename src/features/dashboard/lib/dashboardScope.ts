import {
  filterEmployeesForUser,
  isDirectReport,
} from "@/features/auth/accessPolicy"
import { isHrWriteRole, canViewEmployeeDirectory } from "@/features/auth/permissions"
import type { AuthUser } from "@/features/auth/types"
import type { UserRole } from "@/features/auth/types"
import type { Employee } from "@/features/employees/types"
import { getFullName } from "@/features/employees/types"
import type {
  DashboardActivity,
  PendingLeaveRequest,
} from "../data/mockDashboardData"

export type DashboardVariant = UserRole

export function getDashboardVariant(
  user: AuthUser | null | undefined
): DashboardVariant {
  return user?.role ?? "employee"
}

export function isHrDashboardRole(role: UserRole): boolean {
  return (
    role === "hris_admin" ||
    role === "hris_super_admin" ||
    role === "hrbp" ||
    role === "system_admin"
  )
}

export function getDashboardTitle(variant: DashboardVariant): string {
  switch (variant) {
    case "employee":
      return "My workspace"
    case "manager":
      return "Team overview"
    case "hrbp":
      return "HRBP dashboard"
    case "hris_admin":
      return "HR dashboard"
    case "hris_super_admin":
      return "HRIS SuperAdmin dashboard"
    case "system_admin":
      return "System admin dashboard"
    default:
      return "Dashboard"
  }
}

export function getDashboardSubtitle(variant: DashboardVariant): string {
  switch (variant) {
    case "employee":
      return "Your employment at a glance"
    case "manager":
      return "Monitor your direct reports and team activity"
    case "hrbp":
      return "Workforce insights for your business units"
    case "hris_admin":
      return "Workforce metrics and people operations"
    case "hris_super_admin":
      return "Full workspace access and system overview"
    case "system_admin":
      return "IT operations and access governance"
    default:
      return "Your workspace overview"
  }
}

export type DayPeriod = "morning" | "afternoon" | "evening"

export function getDayPeriod(hour = new Date().getHours()): DayPeriod {
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

export function getTimeGreeting(period: DayPeriod = getDayPeriod()): string {
  switch (period) {
    case "morning":
      return "Welcome back"
    case "afternoon":
      return "Welcome back"
    case "evening":
      return "Welcome back"
    default:
      return "Welcome back"
  }
}

export interface WelcomeBannerContext {
  teamCount?: number
  orgCount?: number
  position?: string
  department?: string
}

export function getWelcomeBannerMessage(
  variant: DashboardVariant,
  ctx: WelcomeBannerContext
): string {
  switch (variant) {
    case "employee": {
      const role =
        ctx.position && ctx.department
          ? `${ctx.position} · ${ctx.department}`
          : (ctx.position ?? ctx.department)
      return role
        ? `You're signed in as ${role}. Here's what's happening in your workspace today.`
        : "Here's what's happening in your workspace today."
    }
    case "manager": {
      const n = ctx.teamCount ?? 0
      const team =
        n === 0
          ? "No direct reports are linked yet."
          : n === 1
            ? "You have 1 direct report on your team."
            : `You have ${n} direct reports on your team.`
      return `${team} Review attendance, leave, and updates below.`
    }
    case "hrbp":
    case "hris_admin": {
      const n = ctx.orgCount
      return n != null && n > 0
        ? `Tracking ${n} employee${n === 1 ? "" : "s"} across the organization. People ops at a glance.`
        : "People operations and workforce metrics at a glance."
    }
    case "hris_super_admin":
      return "You have full access to HRIS settings, users, and organization data."
    case "system_admin":
      return "Monitor system access provisioning and workspace governance."
    default:
      return "Here's your workspace for today."
  }
}

export function getScopedEmployees(
  user: AuthUser | null | undefined,
  employees: Employee[]
): Employee[] {
  if (!user) return []
  if (canViewEmployeeDirectory(user) && user.role !== "manager") {
    return employees
  }
  if (user.role === "manager" && user.employeeId) {
    return employees.filter(
      e => e.managerId === user.employeeId || e.id === user.employeeId
    )
  }
  return filterEmployeesForUser(user, employees)
}

export function getTeamDirectReports(
  user: AuthUser | null | undefined,
  employees: Employee[]
): Employee[] {
  if (!user?.employeeId || user.role !== "manager") return []
  return employees.filter(e => isDirectReport(user, e))
}

export function getSelfEmployee(
  user: AuthUser | null | undefined,
  employees: Employee[]
): Employee | undefined {
  if (!user?.employeeId) return undefined
  return employees.find(e => e.id === user.employeeId)
}

export function filterPendingLeaveForUser(
  user: AuthUser | null | undefined,
  requests: PendingLeaveRequest[],
  employees: Employee[]
): PendingLeaveRequest[] {
  if (!user) return []
  if (isHrWriteRole(user.role)) return requests

  if (user.role === "manager") {
    const teamNames = new Set(
      getTeamDirectReports(user, employees).map(e =>
        getFullName(e).toLowerCase()
      )
    )
    return requests.filter(r => teamNames.has(r.employeeName.toLowerCase()))
  }

  return []
}

export function filterActivitiesForUser(
  user: AuthUser | null | undefined,
  activities: DashboardActivity[],
  employees: Employee[],
  selfName?: string
): DashboardActivity[] {
  if (!user) return []

  if (isHrWriteRole(user.role)) return activities

  if (user.role === "manager") {
    const needles = new Set(
      getTeamDirectReports(user, employees).map(e => e.firstName.toLowerCase())
    )
    if (user.name) needles.add(user.name.split(" ")[0].toLowerCase())
    return activities.filter(a =>
      [...needles].some(
        n =>
          a.description.toLowerCase().includes(n) ||
          a.title.toLowerCase().includes(n)
      )
    )
  }

  if (user.role === "employee" && selfName) {
    const first = selfName.split(" ")[0].toLowerCase()
    return activities.filter(
      a =>
        a.description.toLowerCase().includes(first) ||
        a.type === "leave" ||
        a.type === "attendance"
    )
  }

  return activities.slice(0, 3)
}
