import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function ProfileFieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

export function ProfileField({
  label,
  value,
  className,
}: {
  label: string
  value?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/15 px-4 py-3.5 transition-colors hover:bg-muted/25",
        className
      )}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1.5 break-words text-sm font-semibold text-foreground",
          !value && "font-normal text-muted-foreground"
        )}
      >
        {value ?? "—"}
      </dd>
    </div>
  )
}
