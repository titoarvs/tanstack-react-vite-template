import {
  CalendarClock,
  ClipboardList,
  UserPlus,
  UserRoundCheck,
  Users,
} from "lucide-react"
import type { DashboardActivity } from "../data/mockDashboardData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const activityIcons: Record<DashboardActivity["type"], typeof Users> = {
  hire: UserPlus,
  leave: CalendarClock,
  onboarding: ClipboardList,
  update: UserRoundCheck,
  attendance: Users,
}

function formatRelativeTime(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

interface RecentActivityListProps {
  activities: DashboardActivity[]
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {activities.map(activity => {
            const Icon = activityIcons[activity.type]
            return (
              <li key={activity.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    activity.type === "hire" && "bg-accent text-accent-foreground",
                    activity.type === "leave" && "bg-secondary text-secondary-foreground",
                    activity.type === "onboarding" && "bg-muted text-foreground",
                    activity.type === "update" && "bg-muted text-muted-foreground",
                    activity.type === "attendance" && "bg-accent/70 text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
