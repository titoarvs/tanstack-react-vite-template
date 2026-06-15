import type { Employee } from "../types"

export function getManagersForDepartment(
  employees: Employee[],
  department?: string,
  excludeId?: string
): Employee[] {
  const active = employees.filter(
    e => e.status === "active" && e.id !== excludeId
  )
  const managers = active.filter(e => e.isManager)
  const inDeptManagers = department?.trim()
    ? managers.filter(e => e.department === department)
    : managers

  if (inDeptManagers.length > 0) return inDeptManagers
  if (managers.length > 0) return managers

  if (department?.trim()) {
    const inDept = active.filter(e => e.department === department)
    if (inDept.length > 0) return inDept
  }

  return active
}

export function toManagerSelectOptions(managers: Employee[]) {
  return managers.map(m => ({
    value: m.id,
    label: `${m.firstName} ${m.lastName} — ${m.position}`,
  }))
}

/** Keeps the current selection visible even when department changes. */
export function buildManagerSelectOptions(
  managers: Employee[],
  selectedId?: string,
  allEmployees?: Employee[]
): { value: string; label: string }[] {
  const options = toManagerSelectOptions(managers)
  if (!selectedId?.trim()) return options
  if (options.some(option => option.value === selectedId)) return options

  const selected = allEmployees?.find(employee => employee.id === selectedId)
  if (!selected) return options

  return [
    ...options,
    {
      value: selected.id,
      label: `${selected.firstName} ${selected.lastName} — ${selected.position} (other dept)`,
    },
  ]
}

export function syncManagerIdForDepartment(
  managerId: string | undefined,
  managers: Employee[],
  allEmployees: Employee[]
): string {
  if (!managerId?.trim()) return ""
  if (managers.some(manager => manager.id === managerId)) return managerId
  if (allEmployees.some(employee => employee.id === managerId)) return managerId
  return ""
}
