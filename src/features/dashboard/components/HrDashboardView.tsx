import { Briefcase, CalendarClock, TrendingUp, Users } from "lucide-react"
import { useOnboardingPipelineCounts } from "@/features/onboarding/hooks/useOnboardingPipelineCounts"
import type { useDashboardData } from "../hooks/useDashboardData"
import { AttendanceAreaChart } from "./charts/AttendanceAreaChart"
import { DepartmentBarChart } from "./charts/DepartmentBarChart"
import { EmploymentDonutChart } from "./charts/EmploymentDonutChart"
import { HeadcountTrendChart } from "./charts/HeadcountTrendChart"
import { LeaveRequestsChart } from "./charts/LeaveRequestsChart"
import { WorkforceStatusChart } from "./charts/WorkforceStatusChart"
import { DashboardStatCard } from "./DashboardStatCard"
import { PendingActionsPanel } from "./PendingActionsPanel"
import { RecentActivityList } from "./RecentActivityList"

type DashboardData = ReturnType<typeof useDashboardData>

interface HrDashboardViewProps {
  data: DashboardData
}

export function HrDashboardView({ data }: HrDashboardViewProps) {
  const { needsAttentionCount } = useOnboardingPipelineCounts()
  const { metrics, mock, headcountTrend, activities, pendingLeave, attendanceRate, weeklyAttendance } =
    data

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Total employees"
          value={metrics.totalEmployees}
          hint={`${metrics.activeEmployees} active · ${metrics.inactiveEmployees} inactive`}
          icon={Users}
          trend={
            metrics.newHiresThisMonth > 0
              ? { value: `+${metrics.newHiresThisMonth} new this month`, positive: true }
              : undefined
          }
        />
        <DashboardStatCard
          label="Attendance rate"
          value={`${attendanceRate}%`}
          hint="Org-wide weekday average"
          icon={TrendingUp}
          trend={{ value: "+2.1% vs last week", positive: true }}
        />
        <DashboardStatCard
          label="Pending leave"
          value={mock.pendingLeaveCount}
          hint="Awaiting approval"
          icon={CalendarClock}
        />
        <DashboardStatCard
          label="Open positions"
          value={mock.openPositions}
          hint="Across all departments"
          icon={Briefcase}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HeadcountTrendChart data={headcountTrend} />
        </div>
        <WorkforceStatusChart
          active={metrics.activeEmployees}
          inactive={metrics.inactiveEmployees}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceAreaChart rate={attendanceRate} weekly={weeklyAttendance} />
        </div>
        <EmploymentDonutChart data={metrics.employmentTypeCounts} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DepartmentBarChart data={metrics.departmentCounts.slice(0, 8)} />
        <LeaveRequestsChart data={mock.leaveByType} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityList activities={activities} />
        </div>
        <PendingActionsPanel
          variant="hr"
          pendingLeave={pendingLeave}
          openPositions={mock.openPositions}
          onboardingInProgress={needsAttentionCount}
        />
      </section>
    </div>
  )
}
