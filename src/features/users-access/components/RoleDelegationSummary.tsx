import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  countEnabledDelegatable,
  getRequiredPermissionsForRole,
  getRoleDelegationProfile,
} from "@/features/auth/rbac/rbacPolicy"
import { PERMISSION_GROUPS } from "@/features/auth/rbac/rbacCatalog"
import type { Permission } from "@/features/auth/permissions"
import type { UserRole } from "@/features/auth/types"

const PERMISSION_LABELS = new Map<Permission, string>(
  PERMISSION_GROUPS.flatMap(group =>
    group.permissions.map(permission => [permission.key, permission.label])
  )
)

interface RoleDelegationSummaryProps {
  role: UserRole
  permissions: readonly Permission[]
}

export function RoleDelegationSummary({ role, permissions }: RoleDelegationSummaryProps) {
  const profile = getRoleDelegationProfile(role)
  const required = getRequiredPermissionsForRole(role)
  const { enabled, total } = countEnabledDelegatable(role, permissions)

  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            Delegation scope
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{profile.scope}</p>
          {required.length > 0 && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Always enabled:{" "}
              {required.map(permission => PERMISSION_LABELS.get(permission) ?? permission).join(", ")}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {enabled} of {total} delegated
          </Badge>
        </div>
      </div>
    </div>
  )
}
