import { DollarSign } from "lucide-react"
import type { EmployeePayInsights } from "../../../data/mockEmployeeInsights"
import type { Employee } from "../../../types"
import { formatBoolean, formatCurrency } from "../../../edm/fieldMasking"
import { useEdmFieldAccess } from "../../../hooks/useEdmFieldAccess"
import { EmployeePayInfoTab } from "../EmployeePayInfoTab"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

interface EdmCompensationTabProps {
  employee: Employee
  pay?: EmployeePayInsights | null
  showPayrollHistory?: boolean
}

export function EdmCompensationTab({
  employee,
  pay,
  showPayrollHistory,
}: EdmCompensationTabProps) {
  const salaryAccess = useEdmFieldAccess(employee, "monthlySalary")
  const comp = employee.compensation

  return (
    <div className="space-y-4">
      <ProfileInfoCard title="Compensation master data" icon={DollarSign}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="monthlySalary"
            label="Monthly salary"
            value={
              comp?.monthlySalary != null
                ? formatCurrency(comp.monthlySalary)
                : undefined
            }
          />
          <EdmProfileField
            employee={employee}
            fieldKey="salaryGrade"
            label="Salary grade"
            value={comp?.salaryGrade}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="compensationEffectiveDate"
            label="Effective date"
            value={comp?.effectiveDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="hmoCoverage"
            label="HMO coverage"
            value={
              comp?.hmoEnrolled != null
                ? formatBoolean(comp.hmoEnrolled)
                : undefined
            }
          />
        </ProfileFieldGrid>
        {!salaryAccess.canView && (
          <p className="mt-3 text-xs text-muted-foreground">
            Compensation details are restricted based on your role.
          </p>
        )}
      </ProfileInfoCard>

      {showPayrollHistory && pay && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Payroll history
          </h3>
          <EmployeePayInfoTab pay={pay} />
        </div>
      )}
    </div>
  )
}
