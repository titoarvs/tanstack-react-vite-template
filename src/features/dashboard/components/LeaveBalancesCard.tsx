import type { LeaveBalanceRow } from "@/features/employees/data/mockEmployeeInsights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaveBalancesCardProps {
  balances: LeaveBalanceRow[]
  daysUsedYtd: number
}

export function LeaveBalancesCard({ balances, daysUsedYtd }: LeaveBalancesCardProps) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Leave balances
        </CardTitle>
        <p className="text-sm text-muted-foreground">{daysUsedYtd} days used year to date</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {balances.map(row => (
            <li
              key={row.type}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <span className="text-sm font-medium">{row.type}</span>
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{row.remaining}</span> left
                <span className="mx-1">·</span>
                {row.used} used
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
