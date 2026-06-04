import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DashboardChartCard } from "@/features/dashboard/components/charts/DashboardChartCard"
import { useChartColors } from "@/features/dashboard/hooks/useChartColors"
import type { WeeklyAttendancePoint } from "../../data/mockEmployeeInsights"

interface EmployeeAttendanceChartProps {
  rate: number
  data: WeeklyAttendancePoint[]
}

export function EmployeeAttendanceChart({ rate, data }: EmployeeAttendanceChartProps) {
  const colors = useChartColors()
  const gradientId = "employeeAttendanceFill"

  return (
    <DashboardChartCard
      title="Attendance trend"
      description="Last 12 weeks · mock data"
      action={<p className="text-2xl font-bold text-primary">{rate}%</p>}
      contentClassName="pb-4"
    >
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.green} stopOpacity={0.45} />
                <stop offset="100%" stopColor={colors.green} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 11 }}
              interval={1}
            />
            <YAxis
              domain={[60, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 12 }}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip
              cursor={{ stroke: colors.dullBlue, strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {payload[0]?.value}% attendance
                    </p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={colors.dullBlue}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{ r: 2, fill: colors.green, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: colors.green }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
