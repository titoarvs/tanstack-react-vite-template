import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useChartColors } from "../../hooks/useChartColors"
import type { HeadcountTrendPoint } from "../../data/mockDashboardData"
import { DashboardChartCard } from "./DashboardChartCard"

interface HeadcountTrendChartProps {
  data: HeadcountTrendPoint[]
}

export function HeadcountTrendChart({ data }: HeadcountTrendChartProps) {
  const colors = useChartColors()

  return (
    <DashboardChartCard
      title="Headcount trend"
      description="6-month workforce growth · mock data"
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="headcountFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.dullBlue} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colors.dullBlue} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as HeadcountTrendPoint
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="text-sm text-foreground">Total: {row.total}</p>
                    <p className="text-sm text-success">Active: {row.active}</p>
                    <p className="text-sm text-muted-foreground">New hires: {row.hires}</p>
                  </div>
                )
              }}
            />
            <Area type="monotone" dataKey="total" stroke="none" fill="url(#headcountFill)" />
            <Line
              type="monotone"
              dataKey="total"
              stroke={colors.foreground}
              strokeWidth={2.5}
              dot={{ r: 4, fill: colors.foreground, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke={colors.green}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: colors.green, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-foreground" />
          Total headcount
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-chart-1" />
          Active employees
        </span>
      </div>
    </DashboardChartCard>
  )
}
