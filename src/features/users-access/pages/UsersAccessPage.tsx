import { useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_RANK, USER_ROLES } from "@/features/auth/roles"
import type { Permission } from "@/features/auth/permissions"
import type { UserRole } from "@/features/auth/types"
import { recordRbacUpdated } from "@/features/audit/auditLogger"
import { RolePermissionsEditor } from "../components/RolePermissionsEditor"
import { RoleSelector } from "../components/RoleSelector"

const RBAC_ROLES = [...USER_ROLES].sort((left, right) => ROLE_RANK[right] - ROLE_RANK[left])

export function UsersAccessPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("hris_super_admin")

  function handleSaved(role: UserRole, permissions: Permission[]) {
    recordRbacUpdated(role, permissions.length)
  }

  return (
    <PageContent className="flex min-h-0 w-full max-w-none flex-1 flex-col">
      <PageHeader
        title="Users & access"
        action={
          <p className="max-w-md text-right text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Configure what each role may do. Only permissions applicable to that role are shown.
          </p>
        }
      />

      <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-8">
        <Card className="h-fit border-border/80 xl:sticky xl:top-6">
          <CardContent className="p-4">
            <RoleSelector
              roles={RBAC_ROLES}
              selectedRole={selectedRole}
              onSelect={setSelectedRole}
            />
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="space-y-1 border-b border-border/80 pb-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              {ROLE_LABELS[selectedRole]}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {ROLE_DESCRIPTIONS[selectedRole]}
            </p>
          </div>

          <RolePermissionsEditor
            key={selectedRole}
            role={selectedRole}
            onSaved={handleSaved}
          />
        </div>
      </div>
    </PageContent>
  )
}
