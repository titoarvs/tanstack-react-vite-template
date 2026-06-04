import { cn } from "@/lib/utils"

interface SeatUsageMeterProps {
  used: number
  limit: number
  className?: string
}

export function SeatUsageMeter({ used, limit, className }: SeatUsageMeterProps) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
  const nearLimit = pct >= 85

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Seats used</span>
        <span className={cn("font-medium", nearLimit && "text-destructive")}>
          {used} / {limit >= 9999 ? "∞" : limit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            nearLimit ? "bg-destructive" : "bg-tito-green"
          )}
          style={{ width: `${limit >= 9999 ? Math.min(pct, 100) : pct}%` }}
        />
      </div>
    </div>
  )
}
