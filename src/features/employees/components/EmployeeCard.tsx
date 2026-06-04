import { useState } from "react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useDeleteEmployee } from "../hooks/useEmployees"
import type { Employee } from "../types"
import { getEmploymentTypeLabel, getFullName } from "../types"
import { EmployeeCardFieldRow } from "./EmployeeFieldCells"
import { EmployeeActionsMenu } from "./EmployeeActionsMenu"
import { EmployeeDeleteDialog } from "./EmployeeDeleteDialog"

interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteEmployee = useDeleteEmployee()
  const name = getFullName(employee)
  const typeVariant = employee.employmentType as "full-time" | "internship" | "contract"

  return (
    <>
      <Card className="relative flex h-full min-h-[17.5rem] flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge variant={employee.status === "active" ? "active" : "inactive"}>
            <span
              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                employee.status === "active" ? "bg-primary" : "bg-muted-foreground"
              }`}
            />
            {employee.status === "active" ? "Active" : "Inactive"}
          </Badge>
          <EmployeeActionsMenu
            employeeId={employee.id}
            onDelete={() => setConfirmDelete(true)}
          />
        </div>

        <div className="mb-4 flex flex-col items-center text-center">
          <EmployeeAvatar src={employee.photoUrl} name={name} className="mb-3 h-14 w-14 shrink-0" />
          <h3 className="w-full truncate px-1 font-semibold" title={name}>
            {name}
          </h3>
          <p className="mt-1 w-full truncate px-1 text-sm text-muted-foreground" title={`${employee.position} | ${employee.department}`}>
            {employee.position} | {employee.department}
          </p>
          <Badge variant={typeVariant} className="mt-3">
            {getEmploymentTypeLabel(employee.employmentType)}
          </Badge>
        </div>

        <div className="mt-auto space-y-3 border-t pt-4">
          <EmployeeCardFieldRow label="Office Branch" value={employee.officeBranch} />
          <EmployeeCardFieldRow label="Phone Number" value={employee.contact.phone} />
          <EmployeeCardFieldRow label="Email" value={employee.contact.email} />
        </div>
      </Card>

      <EmployeeDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        employeeName={name}
        onConfirm={() => deleteEmployee.mutate(employee.id)}
      />
    </>
  )
}
