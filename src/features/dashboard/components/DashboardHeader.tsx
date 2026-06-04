import { Link } from "@tanstack/react-router"
import { Settings, UserPlus, UserRound } from "lucide-react"
import { RoleBadge } from "@/features/auth/components/RoleBadge"
import { getEmployeeNavTarget } from "@/features/auth/accessPolicy"
import { PERMISSIONS } from "@/features/auth/permissions"
import type { AuthUser } from "@/features/auth/types"
import type { UserRole } from "@/features/auth/types"
import { Button } from "@/components/ui/button"
import {
  getDashboardSubtitle,
  getDashboardTitle,
} from "../lib/dashboardScope"

interface DashboardHeaderProps {
  user: AuthUser | null
  variant: UserRole
  can: (permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS]) => boolean
}

export function DashboardHeader({ user, variant, can }: DashboardHeaderProps) {
  const title = getDashboardTitle(variant)
  const subtitle = getDashboardSubtitle(variant)
  const canCreate = can(PERMISSIONS.EMPLOYEES_CREATE)
  const employmentLink = user ? getEmployeeNavTarget(user) : "/dashboard"

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
          {user?.role && <RoleBadge role={user.role} />}
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {variant === "employee" && user?.employeeId && (
          <Button asChild>
            <Link to={employmentLink}>
              <UserRound className="h-4 w-4" />
              My employment
            </Link>
          </Button>
        )}
        {variant === "manager" && (
          <Button asChild variant="secondary">
            <Link to="/employees/directory">
              <UserRound className="h-4 w-4" />
              View directory
            </Link>
          </Button>
        )}
        {canCreate && (
          <Button asChild>
            <Link to="/employees/onboarding">
              <UserPlus className="h-4 w-4" />
              Add employee
            </Link>
          </Button>
        )}
        {variant === "admin" && can(PERMISSIONS.USERS_MANAGE) && (
          <Button asChild variant="outline">
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
