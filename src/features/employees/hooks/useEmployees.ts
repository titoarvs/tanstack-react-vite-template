import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  fetchEmployees,
  updateEmployeeEmployment,
} from "../api/employeeApi"
import type { CreateEmployeeInput } from "../types"
import type { EmploymentEditFormData } from "../schemas/employmentEditSchema"

export const employeeKeys = {
  all: ["employees"] as const,
  detail: (id: string) => ["employees", id] as const,
}

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.all,
    queryFn: fetchEmployees,
    staleTime: 30_000,
  })
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => fetchEmployee(id),
    enabled: Boolean(id),
  })
}

export function useManagers(excludeId?: string) {
  const { data } = useEmployees()
  return (data ?? []).filter(e => e.status === "active" && e.id !== excludeId)
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    retry: false,
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    retry: false,
  })
}

export function useUpdateEmployeeEmployment(employeeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EmploymentEditFormData) =>
      updateEmployeeEmployment(employeeId, data),
    onSuccess: updated => {
      queryClient.setQueryData(employeeKeys.detail(employeeId), updated)
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    retry: false,
  })
}
