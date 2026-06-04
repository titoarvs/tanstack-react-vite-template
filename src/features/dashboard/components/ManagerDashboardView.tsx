import { Link } from "@tanstack/react-router"
import { CalendarClock, TrendingUp, UserRound, Users } from "lucide-react"
import type { useDashboardData } from "../hooks/useDashboardData"
import { AttendanceAreaChart } from "./charts/AttendanceAreaChart"
import { EmploymentDonutChart } from "./charts/EmploymentDonutChart"
import { DashboardStatCard } from "./DashboardStatCard"
import { PendingActionsPanel } from "./PendingActionsPanel"
import { RecentActivityList } from "./RecentActivityList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFullName } from "@/features/employees/types"

type DashboardData = ReturnType<typeof useDashboardData>

interface ManagerDashboardViewProps {
  data: DashboardData
}

export function ManagerDashboardView({ data }: ManagerDashboardViewProps) {
  const {
    metrics,
    teamReports,
    pendingLeave,
    activities,
    attendanceRate,
    weeklyAttendance,
    mock,
  } = data

  const teamActive = teamReports.filter(e => e.status === "active").length

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Direct reports"
          value={teamReports.length}
          hint={`${teamActive} active on your team`}
          icon={Users}
        />
        <DashboardStatCard
          label="Team attendance"
          value={`${attendanceRate}%`}
          hint="Weekday average (preview)"
          icon={TrendingUp}
          trend={{ value: "+1.8% vs last week", positive: true }}
        />
        <DashboardStatCard
          label="Pending approvals"
          value={pendingLeave.length}
          hint="Leave awaiting your review"
          icon={CalendarClock}
        />
        <DashboardStatCard
          label="Departments"
          value={metrics.departmentCounts.length}
          hint="Represented on your team"
          icon={UserRound}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceAreaChart rate={attendanceRate} weekly={weeklyAttendance} />
        </div>
        <EmploymentDonutChart data={metrics.employmentTypeCounts} />
      </section>

      {teamReports.length > 0 && (
        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Your team
            </CardTitle>
            <Link
              to="/employees/directory"
              className="text-xs font-medium text-primary hover:underline"
            >
              Full directory
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {teamReports.map(member => (
                <li key={member.id}>
                  <Link
                    to="/employees/$employeeId"
                    params={{ employeeId: member.id }}
                    className="block rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/50"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {getFullName(member)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.position} · {member.department}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityList activities={activities} />
        </div>
        <PendingActionsPanel
          variant="manager"
          pendingLeave={pendingLeave}
          openPositions={mock.openPositions}
          onboardingInProgress={mock.onboardingInProgress}
        />
      </section>
    </div>
  )
}
