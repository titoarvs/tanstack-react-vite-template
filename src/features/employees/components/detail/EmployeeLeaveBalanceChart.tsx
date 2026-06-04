import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DashboardChartCard } from "@/features/dashboard/components/charts/DashboardChartCard"
import { useChartColors } from "@/features/dashboard/hooks/useChartColors"
import type { LeaveBalanceRow } from "../../data/mockEmployeeInsights"

interface EmployeeLeaveBalanceChartProps {
  data: LeaveBalanceRow[]
}

export function EmployeeLeaveBalanceChart({ data }: EmployeeLeaveBalanceChartProps) {
  const colors = useChartColors()

  return (
    <DashboardChartCard
      title="Leave balance"
      description="Days used vs remaining · mock data"
      contentClassName="pb-4"
    >
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="type"
              width={72}
              tickLine={false}
              axisLine={false}
              tick={{ fill: colors.muted, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in oklch, var(--muted) 35%, transparent)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as LeaveBalanceRow
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="text-xs font-medium text-muted-foreground">{row.type} leave</p>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{row.used}</span> used ·{" "}
                      <span className="font-semibold">{row.remaining}</span> remaining
                    </p>
                  </div>
                )
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={value => (
                <span className="text-muted-foreground capitalize">{value}</span>
              )}
            />
            <Bar
              dataKey="used"
              name="Used"
              stackId="leave"
              fill={colors.dullBlue}
              radius={[0, 0, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="remaining"
              name="Remaining"
              stackId="leave"
              fill={colors.green}
              radius={[0, 6, 6, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardChartCard>
  )
}
