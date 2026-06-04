import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContentProps {
  children: ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn("p-4 sm:p-6 lg:p-8", className)}>{children}</div>
}
