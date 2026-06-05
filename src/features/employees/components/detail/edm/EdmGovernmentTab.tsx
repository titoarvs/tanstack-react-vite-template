import { Shield } from "lucide-react"
import type { Employee } from "../../../types"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

interface EdmGovernmentTabProps {
  employee: Employee
}

export function EdmGovernmentTab({ employee }: EdmGovernmentTabProps) {
  const ids = employee.governmentIds

  return (
    <ProfileInfoCard
      title="Government IDs"
      icon={Shield}
      description="Restricted to HR, Payroll, Finance, and the employee."
    >
      <ProfileFieldGrid>
        <EdmProfileField
          employee={employee}
          fieldKey="governmentIds"
          label="TIN"
          value={ids?.tin}
        />
        <EdmProfileField
          employee={employee}
          fieldKey="governmentIds"
          label="SSS"
          value={ids?.sss}
        />
        <EdmProfileField
          employee={employee}
          fieldKey="governmentIds"
          label="PhilHealth"
          value={ids?.philHealth}
        />
        <EdmProfileField
          employee={employee}
          fieldKey="governmentIds"
          label="Pag-IBIG"
          value={ids?.pagIbig}
        />
      </ProfileFieldGrid>
    </ProfileInfoCard>
  )
}
