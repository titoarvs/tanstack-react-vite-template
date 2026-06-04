import { CalendarClock, TrendingUp } from "lucide-react"
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatCard"
import type { EmployeeInsights } from "../../data/mockEmployeeInsights"
import { EmployeeAttendanceChart } from "./EmployeeAttendanceChart"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeePerformanceTabProps {
  insights: EmployeeInsights
  directReports: number
}

export function EmployeePerformanceTab({
  insights,
  directReports,
}: EmployeePerformanceTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardStatCard
          label="Attendance (12 wk)"
          value={`${insights.attendanceRate}%`}
          hint="Rolling average · mock"
          icon={TrendingUp}
        />
        <DashboardStatCard
          label="Leave used (YTD)"
          value={insights.leaveDaysUsedYtd}
          hint="All leave types · mock"
          icon={CalendarClock}
        />
      </div>

      <ProfileInfoCard
        title="Attendance trend"
        icon={TrendingUp}
        description="Weekly attendance rate over the last eight periods."
      >
        <div className="w-full min-w-0">
          <EmployeeAttendanceChart
            rate={insights.attendanceRate}
            data={insights.weeklyAttendance}
          />
        </div>
        {directReports > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Manages {directReports} direct report{directReports === 1 ? "" : "s"}.
          </p>
        )}
      </ProfileInfoCard>
    </div>
  )
}
