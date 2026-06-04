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
import { DashboardChartCard } from "./DashboardChartCard"

interface DepartmentBarChartProps {
  data: { department: string; count: number }[]
}

function truncateLabel(value: string, max = 18) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const colors = useChartColors()
  const chartData = data.map(item => ({
    ...item,
    shortDepartment: truncateLabel(item.department),
  }))

  return (
    <DashboardChartCard
      title="Headcount by department"
      description="Live count from employee directory"
    >
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No employee data yet.</p>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
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
                dataKey="shortDepartment"
                width={108}
                tickLine={false}
                axisLine={false}
                tick={{ fill: colors.foreground, fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in oklch, var(--muted) 35%, transparent)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const row = payload[0]?.payload as { department: string; count: number }
                  return (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                      <p className="text-xs text-muted-foreground">{row.department}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {row.count} employees
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors.palette[index % colors.palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardChartCard>
  )
}
