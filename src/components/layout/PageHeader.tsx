import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
