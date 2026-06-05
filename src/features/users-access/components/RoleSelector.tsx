import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS } from "@/features/auth/roles"
import {
  countEnabledDelegatable,
  getEditablePermissionsForRole,
  roleHasCustomPermissions,
} from "@/features/auth/rbac/rbacPolicy"
import type { UserRole } from "@/features/auth/types"

interface RoleSelectorProps {
  roles: readonly UserRole[]
  selectedRole: UserRole
  onSelect: (role: UserRole) => void
}

function RoleButton({
  role,
  selected,
  onSelect,
  layout,
}: {
  role: UserRole
  selected: boolean
  onSelect: (role: UserRole) => void
  layout: "mobile" | "desktop"
}) {
  const isCustom = roleHasCustomPermissions(role)
  const enabledCount = countEnabledDelegatable(
    role,
    getEditablePermissionsForRole(role)
  ).enabled

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "relative z-10 flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border text-left text-sm transition-colors",
        layout === "mobile" && "shrink-0 px-3 py-2.5",
        layout === "desktop" && "px-3 py-2.5",
        selected
          ? "border-primary/40 bg-primary/5 text-foreground shadow-sm"
          : "border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground"
      )}
    >
      <span className="min-w-0">
        <span className="block font-medium">{ROLE_LABELS[role]}</span>
        {layout === "desktop" && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {enabledCount} delegated
          </span>
        )}
      </span>
      {isCustom && (
        <Badge
          variant={selected ? "default" : "secondary"}
          className="shrink-0 px-1.5 py-0 text-[10px] font-normal"
        >
          Custom
        </Badge>
      )}
    </button>
  )
}

export function RoleSelector({ roles, selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <>
      <div className="lg:hidden">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Role
        </p>
        <div className="scroll-area-x overflow-x-auto pb-1">
          <div className="flex w-max gap-2 pr-1">
            {roles.map(role => (
              <RoleButton
                key={role}
                role={role}
                selected={selectedRole === role}
                onSelect={onSelect}
                layout="mobile"
              />
            ))}
          </div>
        </div>
      </div>

      <nav aria-label="Application roles" className="hidden min-h-0 lg:flex lg:flex-1 lg:flex-col">
        <p className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Roles
        </p>
        <div className="scroll-area min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain pr-1">
          {roles.map(role => (
            <RoleButton
              key={role}
              role={role}
              selected={selectedRole === role}
              onSelect={onSelect}
              layout="desktop"
            />
          ))}
        </div>
      </nav>
    </>
  )
}
