import { Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Permission } from "@/features/auth/permissions"
import {
  getPermissionGroupsForRole,
  isPermissionLocked,
} from "@/features/auth/rbac/rbacPolicy"
import type { UserRole } from "@/features/auth/types"
import { useRolePermissions } from "../hooks/useRolePermissions"
import { RoleDelegationSummary } from "./RoleDelegationSummary"

interface RolePermissionsEditorProps {
  role: UserRole
  onSaved?: (role: UserRole, permissions: Permission[]) => void
}

function PermissionToggle({
  role,
  permission,
  label,
  description,
  checked,
  locked,
  onToggle,
}: {
  role: UserRole
  permission: Permission
  label: string
  description: string
  checked: boolean
  locked: boolean
  onToggle: (enabled: boolean) => void
}) {
  const inputId = `${role}-${permission}`

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
        checked
          ? "border-primary/20 bg-primary/5"
          : "border-border/60 bg-background hover:border-border hover:bg-muted/30",
        locked && "cursor-not-allowed opacity-80"
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={event => onToggle(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
      />
      <div className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-foreground">
          {label}
          {locked && (
            <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
              <Lock className="h-3 w-3" />
              Required
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </div>
    </label>
  )
}

export function RolePermissionsEditor({ role, onSaved }: RolePermissionsEditorProps) {
  const { permissions, isCustom, isDirty, togglePermission, save, reset } =
    useRolePermissions(role)

  const permissionSet = new Set(permissions)
  const permissionGroups = getPermissionGroupsForRole(role)
  const isCompactRole = permissionGroups.length <= 3

  function handleSave() {
    save()
    onSaved?.(role, permissions)
  }

  if (permissionGroups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No delegatable permissions are configured for this role.
      </p>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 pb-24 lg:pb-0">
      <RoleDelegationSummary role={role} permissions={permissions} />

      <div className="flex flex-wrap items-center gap-2">
        {isCustom && (
          <Badge variant="secondary" className="font-normal">
            Custom permissions
          </Badge>
        )}
        {isDirty && (
          <Badge variant="outline" className="font-normal">
            Unsaved changes
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-4",
          isCompactRole ? "grid-cols-1" : "xl:grid-cols-2"
        )}
      >
        {permissionGroups.map(group => (
          <Card
            key={group.id}
            className={cn(
              "border-border/80",
              !isCompactRole && group.permissions.length > 4 && "xl:col-span-2"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                {group.label}
              </CardTitle>
              {group.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              )}
            </CardHeader>
            <CardContent
              className={cn(
                "grid gap-2",
                group.permissions.length > 3 && "md:grid-cols-2",
                group.permissions.length > 6 && "xl:grid-cols-3"
              )}
            >
              {group.permissions.map(definition => (
                <PermissionToggle
                  key={definition.key}
                  role={role}
                  permission={definition.key}
                  label={definition.label}
                  description={definition.description}
                  checked={permissionSet.has(definition.key)}
                  locked={isPermissionLocked(role, definition.key)}
                  onToggle={enabled => togglePermission(definition.key, enabled)}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:static lg:inset-auto lg:z-auto lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" onClick={handleSave} disabled={!isDirty} className="sm:min-w-44">
            Save role permissions
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            disabled={!isCustom && !isDirty}
            className="sm:min-w-44"
          >
            Reset to defaults
          </Button>
        </div>
      </div>
    </div>
  )
}
