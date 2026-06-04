import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useChartColors } from "../../hooks/useChartColors"
import type { LeaveTypeCount } from "../../data/mockDashboardData"
import { DashboardChartCard } from "./DashboardChartCard"

interface LeaveRequestsChartProps {
  data: LeaveTypeCount[]
}

export function LeaveRequestsChart({ data }: LeaveRequestsChartProps) {
  const colors = useChartColors()

  return (
    <DashboardChartCard
      title="Leave requests by type"
      description="Current month · mock data"
    >
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="type"
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
              cursor={{ fill: "color-mix(in oklch, var(--muted) 35%, transparent)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as LeaveTypeCount
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="text-xs text-muted-foreground">{row.type} leave</p>
                    <p className="text-sm font-semibold text-foreground">{row.count} requests</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors.palette[index % colors.palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
