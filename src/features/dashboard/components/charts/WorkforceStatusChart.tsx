import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useChartColors } from "../../hooks/useChartColors"
import { DashboardChartCard } from "./DashboardChartCard"

interface WorkforceStatusChartProps {
  active: number
  inactive: number
}

export function WorkforceStatusChart({ active, inactive }: WorkforceStatusChartProps) {
  const colors = useChartColors()
  const data = [
    { name: "Active", value: active, color: colors.green },
    { name: "Inactive", value: inactive, color: colors.muted },
  ].filter(item => item.value > 0)

  const total = active + inactive

  return (
    <DashboardChartCard title="Workforce status" description="Live active vs inactive split">
      <div className="relative h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="46%"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              strokeWidth={2}
              stroke="var(--card)"
            >
              {data.map(item => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as { name: string; value: number }
                const pct = total > 0 ? Math.round((row.value / total) * 100) : 0
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="text-xs text-muted-foreground">{row.name}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.value} · {pct}%
                    </p>
                  </div>
                )
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={value => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">employees</p>
          </div>
        </div>
      </div>
    </DashboardChartCard>
  )
}
