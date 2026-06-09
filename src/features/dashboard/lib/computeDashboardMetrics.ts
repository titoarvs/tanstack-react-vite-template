import type { Employee, EmploymentType } from "@/features/employees/types"
import { getEmploymentTypeLabel } from "@/features/employees/types"

export interface DashboardMetrics {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  newHiresThisMonth: number
  departmentCounts: { department: string; count: number }[]
  employmentTypeCounts: { type: EmploymentType; count: number; label: string }[]
}

const trackedTypes: EmploymentType[] = ["full_time", "part_time", "intern"]

export function computeDashboardMetrics(employees: Employee[]): DashboardMetrics {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()

  const departmentMap = new Map<string, number>()
  const typeMap = new Map<EmploymentType, number>()

  let activeEmployees = 0
  let newHiresThisMonth = 0

  for (const employee of employees) {
    if (employee.status === "active") activeEmployees += 1

    departmentMap.set(
      employee.department,
      (departmentMap.get(employee.department) ?? 0) + 1
    )

    typeMap.set(
      employee.employmentType,
      (typeMap.get(employee.employmentType) ?? 0) + 1
    )

    const hireDate = new Date(employee.lifecycle.hireDate)
    if (hireDate.getMonth() === month && hireDate.getFullYear() === year) {
      newHiresThisMonth += 1
    }
  }

  const departmentCounts = [...departmentMap.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count)

  const employmentTypeCounts = trackedTypes.map(type => ({
    type,
    count: typeMap.get(type) ?? 0,
    label: getEmploymentTypeLabel(type),
  }))

  return {
    totalEmployees: employees.length,
    activeEmployees,
    inactiveEmployees: employees.length - activeEmployees,
    newHiresThisMonth,
    departmentCounts,
    employmentTypeCounts,
  }
}
