import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  fetchEmployees,
} from "../api/employeeApi"
import type { CreateEmployeeInput } from "../types"

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
