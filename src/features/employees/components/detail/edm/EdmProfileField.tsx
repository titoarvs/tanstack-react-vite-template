import { Lock } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { EdmFieldKey } from "../../../edm/types"
import type { Employee } from "../../../types"
import {
  resolveDisplayValue,
  useEdmFieldAccess,
} from "../../../hooks/useEdmFieldAccess"
import { ProfileField } from "../EmployeeProfileFields"

interface EdmProfileFieldProps {
  employee: Employee
  fieldKey: EdmFieldKey
  label: string
  value?: string
  className?: string
}

export function EdmProfileField({
  employee,
  fieldKey,
  label,
  value,
  className,
}: EdmProfileFieldProps) {
  const { isHidden, isMasked, canView, level } = useEdmFieldAccess(
    employee,
    fieldKey
  )

  if (isHidden || !canView) return null

  const display = resolveDisplayValue(fieldKey, value, isMasked)

  return (
    <ProfileField
      label={label}
      value={display}
      className={cn(className, isMasked && "border-dashed")}
      suffix={
        isMasked || level === "view" ? (
          <Lock className="ml-1 inline h-3 w-3 text-muted-foreground" aria-hidden />
        ) : undefined
      }
    />
  )
}

interface EdmProfileSectionProps {
  employee: Employee
  fieldKey: EdmFieldKey
  children: ReactNode
}

/** Hide entire section when field group is not visible */
export function EdmProfileSection({
  employee,
  fieldKey,
  children,
}: EdmProfileSectionProps) {
  const { canView } = useEdmFieldAccess(employee, fieldKey)
  if (!canView) return null
  return <>{children}</>
}
