import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProfileInfoCardProps {
  title: string
  icon?: LucideIcon
  description?: string
  children: ReactNode
  className?: string
}

export function ProfileInfoCard({
  title,
  icon: Icon,
  description,
  children,
  className,
}: ProfileInfoCardProps) {
  return (
    <Card className={cn("border-border/80 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
        {Icon && (
          <div className="profile-section-icon shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
