import { cn } from "@/lib/utils"

export function RequiredMark({ className }: { className?: string }) {
  return (
    <span className={cn("text-destructive", className)} aria-hidden="true">
      *
    </span>
  )
}
