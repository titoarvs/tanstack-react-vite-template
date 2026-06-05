import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approvePreEmploymentInvite,
  createPreEmploymentInvite,
  getPreEmploymentInvite,
  getPreEmploymentInviteByToken,
  listPreEmploymentInvites,
  rejectPreEmploymentInvite,
  savePreEmploymentProgress,
  submitPreEmploymentForm,
  suggestEmployeeIdForApproval,
} from "../api/preEmploymentApi"
import type {
  ApprovePreEmploymentInput,
  CreatePreEmploymentInviteInput,
  PreEmploymentFormData,
} from "../types"

export const preEmploymentKeys = {
  all: ["pre-employment"] as const,
  list: () => [...preEmploymentKeys.all, "list"] as const,
  detail: (id: string) => [...preEmploymentKeys.all, "detail", id] as const,
  token: (token: string) => [...preEmploymentKeys.all, "token", token] as const,
}

export function usePreEmploymentInvites(enabled = true) {
  return useQuery({
    queryKey: preEmploymentKeys.list(),
    queryFn: listPreEmploymentInvites,
    enabled,
  })
}

export function usePreEmploymentInvite(id: string) {
  return useQuery({
    queryKey: preEmploymentKeys.detail(id),
    queryFn: () => getPreEmploymentInvite(id),
    enabled: Boolean(id),
  })
}

export function usePreEmploymentByToken(token: string) {
  return useQuery({
    queryKey: preEmploymentKeys.token(token),
    queryFn: () => getPreEmploymentInviteByToken(token),
    enabled: Boolean(token),
    retry: false,
  })
}

export function useCreatePreEmploymentInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePreEmploymentInviteInput) =>
      createPreEmploymentInvite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preEmploymentKeys.all })
    },
  })
}

export function useSavePreEmploymentProgress(token: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PreEmploymentFormData>) =>
      savePreEmploymentProgress(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preEmploymentKeys.token(token) })
    },
  })
}

export function useSubmitPreEmploymentForm(token: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PreEmploymentFormData) =>
      submitPreEmploymentForm(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preEmploymentKeys.token(token) })
    },
  })
}

export function useRejectPreEmploymentInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      rejectPreEmploymentInvite(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preEmploymentKeys.all })
    },
  })
}

export function useApprovePreEmploymentInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      employment,
    }: {
      id: string
      employment: ApprovePreEmploymentInput
    }) => approvePreEmploymentInvite(id, employment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preEmploymentKeys.all })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },
  })
}

export function useSuggestEmployeeIdForApproval() {
  return useQuery({
    queryKey: [...preEmploymentKeys.all, "suggest-id"],
    queryFn: suggestEmployeeIdForApproval,
  })
}
