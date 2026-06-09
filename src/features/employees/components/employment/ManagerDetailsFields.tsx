import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormSelectField } from "@/components/ui/form-select-field"
import { Input } from "@/components/ui/input"
import { useManagersByDepartment } from "../../hooks/useManagersByDepartment"
import { toManagerSelectOptions } from "../../lib/managerOptions"

interface ManagerDetailsFieldsProps {
  departmentField?: string
  managerIdField?: string
  isManagerField?: string
}

export function ManagerDetailsFields({
  departmentField = "department",
  managerIdField = "managerId",
  isManagerField = "isManager",
}: ManagerDetailsFieldsProps) {
  const form = useFormContext<Record<string, unknown>>()
  const department = form.watch(departmentField) as string | undefined
  const isManager = Boolean(form.watch(isManagerField))
  const managerId = form.watch(managerIdField) as string | undefined
  const managers = useManagersByDepartment(department)
  const manager = managers.find(m => m.id === managerId)

  useEffect(() => {
    if (isManager) {
      form.setValue(managerIdField, "")
      form.clearErrors(managerIdField)
    }
  }, [form, isManager, managerIdField])

  if (isManager) return null

  const managerOptions = toManagerSelectOptions(managers)

  return (
    <>
      <FormSelectField
        name={managerIdField}
        label="Supervisor / Manager"
        options={managerOptions}
        placeholder="Select manager"
      />

      <div>
        <FormLabel>Manager email</FormLabel>
        <Input
          readOnly
          value={manager?.contact.email ?? ""}
          placeholder="Auto-populated"
          className="bg-muted/40"
        />
      </div>
      <FormField
        control={form.control}
        name={managerIdField}
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
