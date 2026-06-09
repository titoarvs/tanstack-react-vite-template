import type { Employee } from "../types"

export function getManagersForDepartment(
  employees: Employee[],
  department?: string,
  excludeId?: string
): Employee[] {
  const active = employees.filter(
    e => e.status === "active" && e.id !== excludeId
  )
  if (!department?.trim()) return active
  const inDept = active.filter(e => e.department === department)
  return inDept.length > 0 ? inDept : active
}

export function toManagerSelectOptions(managers: Employee[]) {
  return managers.map(m => ({
    value: m.id,
    label: `${m.firstName} ${m.lastName} — ${m.position}`,
  }))
}
