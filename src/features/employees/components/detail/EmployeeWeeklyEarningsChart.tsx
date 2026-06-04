import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useChartColors } from "@/features/dashboard/hooks/useChartColors"
import type { WeeklyEarningsPoint } from "../../data/mockEmployeeInsights"
import { formatCurrency } from "../../lib/formatCurrency"

interface EmployeeWeeklyEarningsChartProps {
  data: WeeklyEarningsPoint[]
  highlightDay?: string
}

export function EmployeeWeeklyEarningsChart({
  data,
  highlightDay = "Wed",
}: EmployeeWeeklyEarningsChartProps) {
  const colors = useChartColors()
  const gradientId = "weeklyEarningsFill"
  const maxAmount = Math.max(...data.map(d => d.amount), 1)

  return (
    <div className="h-[min(220px,50vw)] min-h-[160px] w-full sm:h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.green} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colors.green} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: colors.muted, fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: colors.muted, fontSize: 10 }}
            tickFormatter={v =>
              Number(v) >= 1000 ? `$${Math.round(Number(v) / 1000)}k` : `$${v}`
            }
            domain={[0, Math.ceil(maxAmount / 500) * 500 + 500]}
            width={36}
          />
          <Tooltip
            cursor={{ stroke: colors.dullBlue, strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const row = payload[0]?.payload as WeeklyEarningsPoint
              return (
                <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(row.amount)}
                  </p>
                  {row.hours != null && row.hours > 0 && (
                    <p className="text-xs text-muted-foreground">{row.hours} hours</p>
                  )}
                </div>
              )
            }}
          />
          <ReferenceLine
            x={highlightDay}
            stroke={colors.dullBlue}
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={colors.green}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 4, fill: colors.green, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: colors.green }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
