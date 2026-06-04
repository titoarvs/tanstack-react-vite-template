import { CalendarClock } from "lucide-react"
import type { EmployeeInsights } from "../../data/mockEmployeeInsights"
import { EmployeeLeaveBalanceChart } from "./EmployeeLeaveBalanceChart"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeeTimeOffTabProps {
  insights: EmployeeInsights
}

export function EmployeeTimeOffTab({ insights }: EmployeeTimeOffTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <ProfileInfoCard
        title="Leave balances"
        icon={CalendarClock}
        description="Current entitlement by leave type (mock data)."
        className="lg:col-span-1"
      >
        <div className="w-full min-w-0">
          <EmployeeLeaveBalanceChart data={insights.leaveBalances} />
        </div>
      </ProfileInfoCard>

      <ProfileInfoCard title="Policy notes" description="Phase 1 preview only.">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5">
            Balances refresh on a monthly cycle in production.
          </li>
          <li className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5">
            Request time off from the Time off module when available.
          </li>
          <li className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5">
            {insights.leaveDaysUsedYtd} days used year-to-date across all types.
          </li>
        </ul>
      </ProfileInfoCard>
    </div>
  )
}
