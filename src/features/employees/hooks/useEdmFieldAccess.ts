import { useAuth } from "@/features/auth/useAuth"
import type { Employee } from "../types"
import { resolveFieldAccess } from "../edm/fieldPolicy"
import type { EdmFieldKey } from "../edm/types"
import { maskValue } from "../edm/fieldMasking"

export function useEdmFieldAccess(
  employee: Employee,
  fieldKey: EdmFieldKey
) {
  const { user } = useAuth()
  const access = user
    ? resolveFieldAccess(user, fieldKey, employee.id, employee)
    : { level: "hidden" as const, canView: false, canEdit: false }

  return {
    ...access,
    isHidden: !access.canView,
    isMasked: access.level === "limited_view",
    isEditable: access.canEdit,
  }
}

export function resolveDisplayValue(
  fieldKey: EdmFieldKey,
  value: string | undefined,
  isMasked: boolean
): string | undefined {
  if (!value?.trim()) return undefined
  if (isMasked) return maskValue(fieldKey, value)
  return value
}
