import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getRoleLabel } from "../roles"
import type { UserRole } from "../types"

const ROLE_VARIANT: Record<UserRole, string> = {
  employee: "border-border bg-muted text-muted-foreground",
  manager: "border-transparent bg-secondary text-secondary-foreground",
  hr_admin: "border-transparent bg-accent text-accent-foreground",
  admin: "border-transparent bg-primary text-primary-foreground",
}

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", ROLE_VARIANT[role], className)}
    >
      {getRoleLabel(role)}
    </Badge>
  )
}
