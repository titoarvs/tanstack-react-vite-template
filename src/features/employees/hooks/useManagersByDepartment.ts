import { useMemo } from "react"
import { getManagersForDepartment } from "../lib/managerOptions"
import { useEmployees } from "./useEmployees"

export function useManagersByDepartment(department?: string, excludeId?: string) {
  const { data } = useEmployees()
  return useMemo(
    () => getManagersForDepartment(data ?? [], department, excludeId),
    [data, department, excludeId]
  )
}
