import type { Employee } from "@/features/employees/types"
import { getFullName } from "@/features/employees/types"
import { Card, CardContent } from "@/components/ui/card"

interface HrAssignedSummaryProps {
  employee: Employee
}

export function HrAssignedSummary({ employee }: HrAssignedSummaryProps) {
  return (
    <Card className="border-border/80 bg-muted/20">
      <CardContent className="grid gap-3 p-4 text-sm sm:grid-cols-2 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your role
          </p>
          <p className="mt-1 font-medium text-foreground">{getFullName(employee)}</p>
          <p className="text-muted-foreground">
            {employee.position} · {employee.department}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Work details
          </p>
          <p className="mt-1 text-foreground">{employee.employeeId}</p>
          <p className="text-muted-foreground">{employee.contact.email}</p>
          <p className="text-muted-foreground">{employee.officeBranch} office</p>
        </div>
      </CardContent>
    </Card>
  )
}
