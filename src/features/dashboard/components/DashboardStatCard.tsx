import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  trend?: { value: string; positive?: boolean }
  className?: string
}

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: DashboardStatCardProps) {
  return (
    <Card className={cn("border-border/80", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-muted-foreground"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
