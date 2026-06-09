import { Briefcase, CalendarRange } from "lucide-react"
import type { Employee } from "../../../types"
import { getWorkLocationLabel } from "../../../data/masterData"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

interface EdmEmploymentTabProps {
  employee: Employee
}

export function EdmEmploymentTab({ employee }: EdmEmploymentTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Organisation" icon={Briefcase}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="orgStructure"
            label="Organization level"
            value={employee.orgLevel}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="orgStructure"
            label="Business unit"
            value={employee.businessUnit}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="orgStructure"
            label="Cost center"
            value={employee.costCenter}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="workLocation"
            label="Work location"
            value={getWorkLocationLabel(employee.workLocation)}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Employment dates" icon={CalendarRange}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="dateHired"
            label="Date hired"
            value={employee.lifecycle.hireDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="probationRegularization"
            label="Probation end"
            value={employee.lifecycle.probationEndDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="probationRegularization"
            label="Regularization date"
            value={employee.regularizationDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="dateContractSigned"
            label="Date contract signed"
            value={employee.contractSignedDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="dateHired"
            label="Contract start"
            value={employee.lifecycle.contractStartDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="dateHired"
            label="Contract end"
            value={employee.lifecycle.contractEndDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="terminationDate"
            label="Termination / resignation date"
            value={employee.lifecycle.terminationDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="separationReason"
            label="Separation reason"
            value={employee.separationReason}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
