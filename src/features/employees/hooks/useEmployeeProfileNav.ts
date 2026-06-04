import { useMemo } from "react"
import type { Employee } from "../types"
import { getFullName } from "../types"

export function useEmployeeProfileNav(currentId: string, employees: Employee[] | undefined) {
  return useMemo(() => {
    const sorted = [...(employees ?? [])].sort((a, b) => {
      const last = a.lastName.localeCompare(b.lastName)
      if (last !== 0) return last
      return a.firstName.localeCompare(b.firstName)
    })
    const index = sorted.findIndex(e => e.id === currentId)
    const total = sorted.length
    const position = index >= 0 ? index + 1 : 0
    return {
      sorted,
      index,
      position,
      total,
      prev: index > 0 ? sorted[index - 1] : undefined,
      next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
      getLabel: (e: Employee) => getFullName(e),
    }
  }, [currentId, employees])
}
