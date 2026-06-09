import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface OnboardingStepShellProps {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}

export function OnboardingStepShell({
  icon: Icon,
  title,
  description,
  children,
}: OnboardingStepShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="profile-section-icon shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export function OnboardingFormSection({
  title,
  children,
  cols = 2,
}: {
  title?: string
  children: ReactNode
  cols?: number
}) {
  return (
    <section className="rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-5">
      {title && (
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      <div className={cn("grid gap-4", `sm:grid-cols-${cols}`)}>{children}</div>
    </section>
  )
}
