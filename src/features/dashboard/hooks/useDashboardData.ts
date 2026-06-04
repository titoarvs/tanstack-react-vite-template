import { useMemo } from "react"
import { useAuth } from "@/features/auth/useAuth"
import { useEmployees } from "@/features/employees/hooks/useEmployees"
import { getEmployeeInsights } from "@/features/employees/data/mockEmployeeInsights"
import { mockDashboardData } from "../data/mockDashboardData"
import {
  filterActivitiesForUser,
  filterPendingLeaveForUser,
  getDashboardVariant,
  getScopedEmployees,
  getSelfEmployee,
  getTeamDirectReports,
} from "../lib/dashboardScope"
import { computeDashboardMetrics } from "../lib/computeDashboardMetrics"

export function useDashboardData() {
  const { user } = useAuth()
  const { data: allEmployees, isLoading, isError } = useEmployees()

  const variant = getDashboardVariant(user)

  const scopedEmployees = useMemo(
    () => getScopedEmployees(user, allEmployees ?? []),
    [user, allEmployees]
  )

  const teamReports = useMemo(
    () => getTeamDirectReports(user, allEmployees ?? []),
    [user, allEmployees]
  )

  const selfEmployee = useMemo(
    () => getSelfEmployee(user, allEmployees ?? []),
    [user, allEmployees]
  )

  const metrics = useMemo(() => {
    if (variant === "employee") {
      return computeDashboardMetrics(selfEmployee ? [selfEmployee] : [])
    }
    if (variant === "manager") {
      return computeDashboardMetrics(teamReports)
    }
    return computeDashboardMetrics(allEmployees ?? [])
  }, [variant, selfEmployee, teamReports, allEmployees])

  const personalInsights = useMemo(
    () => (selfEmployee ? getEmployeeInsights(selfEmployee.id) : null),
    [selfEmployee]
  )

  const headcountTrend = useMemo(() => {
    const trend = mockDashboardData.headcountTrend.map(point => ({ ...point }))
    if (allEmployees && trend.length > 0) {
      const lastIndex = trend.length - 1
      const total =
        variant === "manager"
          ? teamReports.length
          : variant === "employee"
            ? selfEmployee
              ? 1
              : 0
            : metrics.totalEmployees
      const active =
        variant === "manager"
          ? teamReports.filter(e => e.status === "active").length
          : metrics.activeEmployees
      trend[lastIndex] = {
        ...trend[lastIndex],
        total,
        active,
      }
    }
    return trend
  }, [allEmployees, metrics, variant, teamReports, selfEmployee])

  const pendingLeave = useMemo(
    () => filterPendingLeaveForUser(user, mockDashboardData.pendingLeave, allEmployees ?? []),
    [user, allEmployees]
  )

  const activities = useMemo(
    () =>
      filterActivitiesForUser(
        user,
        mockDashboardData.activities,
        allEmployees ?? [],
        user?.name
      ),
    [user, allEmployees]
  )

  const weeklyAttendance = useMemo(() => {
    if (variant === "employee" && personalInsights) {
      const lastEight = personalInsights.weeklyAttendance.slice(-8)
      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return dayLabels.map((day, i) => ({
        day,
        rate: lastEight[i]?.rate ?? personalInsights.attendanceRate,
      }))
    }
    return mockDashboardData.weeklyAttendance
  }, [variant, personalInsights])

  const attendanceRate =
    variant === "employee" && personalInsights
      ? personalInsights.attendanceRate
      : mockDashboardData.attendanceRate

  return {
    variant,
    user,
    metrics,
    mock: mockDashboardData,
    headcountTrend,
    scopedEmployees,
    teamReports,
    selfEmployee,
    personalInsights,
    pendingLeave,
    activities,
    weeklyAttendance,
    attendanceRate,
    isLoading,
    isError,
  }
}
