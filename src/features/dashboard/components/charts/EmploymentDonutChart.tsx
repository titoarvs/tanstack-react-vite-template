import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useEmploymentChartColors } from "../../hooks/useChartColors"
import type { DashboardMetrics } from "../../lib/computeDashboardMetrics"
import { DashboardChartCard } from "./DashboardChartCard"

interface EmploymentDonutChartProps {
  data: DashboardMetrics["employmentTypeCounts"]
}

export function EmploymentDonutChart({ data }: EmploymentDonutChartProps) {
  const employmentColors = useEmploymentChartColors()
  const filtered = data.filter(item => item.count > 0)
  const total = filtered.reduce((sum, item) => sum + item.count, 0) || 1

  return (
    <DashboardChartCard
      title="Employment mix"
      description="Distribution by contract type"
      action={<span className="text-sm font-semibold text-foreground">{total} total</span>}
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filtered}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              strokeWidth={2}
              stroke="var(--card)"
            >
              {filtered.map(item => (
                <Cell
                  key={item.type}
                  fill={employmentColors[item.type] ?? employmentColors.contract}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as { label: string; count: number }
                const pct = Math.round((row.count / total) * 100)
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.count} · {pct}%
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
      </div>
    </DashboardChartCard>
  )
}
