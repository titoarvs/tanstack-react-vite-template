import type { AuthUser } from "@/features/auth/types"
import type { UserRole } from "@/features/auth/types"
import type { Employee } from "@/features/employees/types"
import {
  getDayPeriod,
  getTimeGreeting,
  getWelcomeBannerMessage,
} from "../lib/dashboardScope"

interface DashboardWelcomeBannerProps {
  user: AuthUser | null
  variant: UserRole
  teamCount?: number
  orgCount?: number
  selfEmployee?: Employee
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date())
}

export function DashboardWelcomeBanner({
  user,
  variant,
  teamCount,
  orgCount,
  selfEmployee,
}: DashboardWelcomeBannerProps) {
  const firstName = user?.name.split(" ")[0] ?? "there"
  const period = getDayPeriod()
  const greeting = getTimeGreeting(period)
  const message = getWelcomeBannerMessage(variant, {
    teamCount,
    orgCount,
    position: selfEmployee?.position,
    department: selfEmployee?.department,
  })

  return (
    <section
      className="relative mb-6 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
      aria-label="Welcome"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--tito-green) 18%, transparent) 0%, transparent 50%), radial-gradient(circle at 0% 100%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 45%)",
        }}
      />
      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {formatTodayLabel()}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {greeting} {firstName}!
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </section>
  )
}
