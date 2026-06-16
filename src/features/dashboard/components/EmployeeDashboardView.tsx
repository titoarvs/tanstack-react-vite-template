import { Link } from "@tanstack/react-router"
import { CalendarClock, Clock, Palmtree, TrendingUp } from "lucide-react"
import { getEmployeeNavTarget } from "@/features/auth/accessPolicy"
import { formatTenure } from "@/features/employees/data/mockEmployeeInsights"
import type { useDashboardData } from "../hooks/useDashboardData"
import { EmployeeDocumentsChecklistFloater } from "./EmployeeDocumentsChecklistFloater"
import { AttendanceAreaChart } from "./charts/AttendanceAreaChart"
import { DashboardStatCard } from "./DashboardStatCard"
import { LeaveBalancesCard } from "./LeaveBalancesCard"
import { PersonalQuickActions } from "./PersonalQuickActions"
import { RecentActivityList } from "./RecentActivityList"
import { Card, CardContent } from "@/components/ui/card"

type DashboardData = ReturnType<typeof useDashboardData>

interface EmployeeDashboardViewProps {
  data: DashboardData
}

export function EmployeeDashboardView({ data }: EmployeeDashboardViewProps) {
  const { user, selfEmployee, personalInsights, activities, weeklyAttendance, attendanceRate } =
    data

  if (!user?.employeeId || !selfEmployee || !personalInsights) {
    return (
      <Card className="border-dashed border-border/80">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your account is not linked to an employee record. Contact HR to access your
            employment details.
          </p>
        </CardContent>
      </Card>
    )
  }

  const annual = personalInsights.leaveBalances.find(b => b.type === "Annual")
  const profileTo = getEmployeeNavTarget(user)

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="My attendance"
          value={`${attendanceRate}%`}
          hint="Rolling average"
          icon={TrendingUp}
          trend={{ value: "On track this month", positive: true }}
        />
        <DashboardStatCard
          label="Leave used (YTD)"
          value={personalInsights.leaveDaysUsedYtd}
          hint="All leave types"
          icon={CalendarClock}
        />
        <DashboardStatCard
          label="Annual leave left"
          value={annual?.remaining ?? "—"}
          hint={annual ? `${annual.used} days used` : undefined}
          icon={Palmtree}
        />
        <DashboardStatCard
          label="Tenure"
          value={formatTenure(selfEmployee.lifecycle.hireDate)}
          hint={`${selfEmployee.position} · ${selfEmployee.department}`}
          icon={Clock}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceAreaChart rate={attendanceRate} weekly={weeklyAttendance} />
        </div>
        <LeaveBalancesCard
          balances={personalInsights.leaveBalances}
          daysUsedYtd={personalInsights.leaveDaysUsedYtd}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityList activities={activities} />
        </div>
        <div className="space-y-4">
          <PersonalQuickActions user={user} />
          <Card className="border-border/80 bg-muted/30">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Need to update your details?{" "}
              <Link to={profileTo} className="font-medium text-primary hover:underline">
                Open your employment profile
              </Link>{" "}
              and use Request a change.
            </CardContent>
          </Card>
        </div>
      </section>
      </div>

      <EmployeeDocumentsChecklistFloater
        employee={selfEmployee}
        profileHref={profileTo}
      />
    </>
  )
}
