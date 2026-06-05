import { KeyRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Employee } from "../../../types"
import { useEdmFieldAccess } from "../../../hooks/useEdmFieldAccess"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileSection } from "./EdmProfileField"

interface EdmAccessTabProps {
  employee: Employee
}

export function EdmAccessTab({ employee }: EdmAccessTabProps) {
  const access = useEdmFieldAccess(employee, "systemAccess")
  const systems = employee.systemAccess?.systems ?? []

  return (
    <EdmProfileSection employee={employee} fieldKey="systemAccess">
      <ProfileInfoCard
        title="Company systems access"
        icon={KeyRound}
        description="Provisioned tools and request status from IT."
      >
        {systems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No system access recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">System</th>
                  <th className="py-2 pr-4">Request status</th>
                  <th className="py-2 pr-4">Provisioned</th>
                  <th className="py-2">Deprovisioned</th>
                </tr>
              </thead>
              <tbody>
                {systems.map(sys => (
                  <tr key={sys.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium">{sys.name}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline">{sys.requestStatus}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {access.isMasked ? "—" : (sys.provisionedDate ?? "—")}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {access.isMasked ? "—" : (sys.deprovisionedDate ?? "—")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ProfileInfoCard>
    </EdmProfileSection>
  )
}
