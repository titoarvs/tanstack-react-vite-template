import { DollarSign } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EmployeePayInsights } from "../../data/mockEmployeeInsights"
import { formatCurrency } from "../../lib/formatCurrency"
import { EmployeePayMetricCards } from "./EmployeePayMetricCards"
import { EmployeeWeeklyEarningsChart } from "./EmployeeWeeklyEarningsChart"
import { PaystubHistory } from "./PaystubHistory"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeePayInfoTabProps {
  pay: EmployeePayInsights
}

export function EmployeePayInfoTab({ pay }: EmployeePayInfoTabProps) {
  const [range, setRange] = useState("ytd")

  return (
    <div className="space-y-4">
      <EmployeePayMetricCards
        grossPay={pay.grossPay}
        taxes={pay.taxes}
        deductions={pay.deductions}
        trends={pay.metricTrends}
      />

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="profile-section-icon shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Current period</CardTitle>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {formatCurrency(pay.netPay)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            View paystub
          </Button>
        </CardHeader>
        <CardContent className="px-2 py-4 sm:px-6 sm:py-6">
          <EmployeeWeeklyEarningsChart data={pay.weeklyEarnings} />
        </CardContent>
      </Card>

      <ProfileInfoCard title="Paystub history" icon={DollarSign}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="text-left text-sm font-medium text-primary hover:underline"
          >
            Show all periods
          </button>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-9 w-full border-border bg-background sm:w-[10rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <PaystubHistory rows={pay.paystubHistory} />
        <p className="mt-3 text-xs text-muted-foreground">
          Mock payroll data for demo purposes.
        </p>
      </ProfileInfoCard>
    </div>
  )
}
