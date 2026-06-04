import type { EmployeeFilters } from "../types"

export const defaultEmployeeFilters: EmployeeFilters = {
  search: "",
  status: "all",
  department: "all",
  employmentType: "all",
  officeBranch: "all",
}

export function countActiveFilters(filters: EmployeeFilters) {
  let count = 0
  if (filters.status && filters.status !== "all") count += 1
  if (filters.department && filters.department !== "all") count += 1
  if (filters.employmentType && filters.employmentType !== "all") count += 1
  if (filters.officeBranch && filters.officeBranch !== "all") count += 1
  return count
}
