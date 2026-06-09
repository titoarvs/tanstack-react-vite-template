import { Briefcase, CalendarRange } from "lucide-react"
import { useAuth } from "@/features/auth/useAuth"
import { EmploymentDetailsEditor } from "../../employment/EmploymentDetailsEditor"
import {
  getEmploymentTypeLabel,
  getFullStatusLabel,
  getWorkLocationLabel,
} from "../../../data/masterData"
import { canEditEmploymentDetails } from "../../../edm/fieldPolicy"
import { useEmployees } from "../../../hooks/useEmployees"
import type { Employee } from "../../../types"
import { getFullName } from "../../../types"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

interface EdmEmploymentTabProps {
  employee: Employee
}

function EmploymentDetailsView({ employee }: { employee: Employee }) {
  const { data: employees } = useEmployees()
  const manager = employees?.find(e => e.id === employee.managerId)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Role & team" icon={Briefcase}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="employeeStatus"
            label="Status"
            value={getFullStatusLabel(employee.status, employee.statusDetail)}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="departmentPosition"
            label="Department"
            value={employee.department}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="departmentPosition"
            label="Position"
            value={employee.position}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="departmentPosition"
            label="Job title"
            value={employee.jobTitle}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="departmentPosition"
            label="Is manager"
            value={employee.isManager ? "Yes" : "No"}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="supervisor"
            label="Manager"
            value={manager ? getFullName(manager) : undefined}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="workLocation"
            label="Work location"
            value={getWorkLocationLabel(employee.workLocation)}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="employmentType"
            label="Employment type"
            value={getEmploymentTypeLabel(employee.employmentType)}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

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
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Employment dates" icon={CalendarRange} className="lg:col-span-2">
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

export function EdmEmploymentTab({ employee }: EdmEmploymentTabProps) {
  const { user } = useAuth()
  const canEdit = canEditEmploymentDetails(user, employee.id, employee)

  if (canEdit) {
    return <EmploymentDetailsEditor employee={employee} />
  }

  return <EmploymentDetailsView employee={employee} />
}
