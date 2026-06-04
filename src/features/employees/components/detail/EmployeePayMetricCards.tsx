import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PayMetricTrend } from "../../data/mockEmployeeInsights"
import { formatCurrency } from "../../lib/formatCurrency"

interface EmployeePayMetricCardsProps {
  grossPay: number
  taxes: number
  deductions: number
  trends: PayMetricTrend
}

export function EmployeePayMetricCards({
  grossPay,
  taxes,
  deductions,
  trends,
}: EmployeePayMetricCardsProps) {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        label="Total gross pay"
        amount={grossPay}
        trend={trends.gross}
      />
      <MetricCard label="Taxes" amount={taxes} trend={trends.taxes} />
      <MetricCard
        label="Deductions"
        amount={deductions}
        trend={trends.deductions}
      />
    </div>
  )
}

function MetricCard({
  label,
  amount,
  trend,
}: {
  label: string
  amount: number
  trend: { value: string; positive: boolean }
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <p className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(amount)}
          </p>
          <span
            className={cn(
              trend.positive ? "trend-pill-positive" : "trend-pill-negative"
            )}
          >
            {trend.value}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
