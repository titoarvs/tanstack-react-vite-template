import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { FormSelectField } from "@/components/ui/form-select-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployees } from "../../hooks/useEmployees"
import { useManagersByDepartment } from "../../hooks/useManagersByDepartment"
import {
  buildManagerSelectOptions,
  syncManagerIdForDepartment,
} from "../../lib/managerOptions"

interface ManagerDetailsFieldsProps {
  departmentField?: string
  managerIdField?: string
  excludeEmployeeId?: string
}

export function ManagerDetailsFields({
  departmentField = "department",
  managerIdField = "managerId",
  excludeEmployeeId,
}: ManagerDetailsFieldsProps) {
  const form = useFormContext<Record<string, unknown>>()
  const department = form.watch(departmentField) as string | undefined
  const managerId = form.watch(managerIdField) as string | undefined
  const { data: allEmployees = [] } = useEmployees()
  const managers = useManagersByDepartment(department, excludeEmployeeId)
  const manager = allEmployees.find(employee => employee.id === managerId)
  const managerOptions = buildManagerSelectOptions(
    managers,
    managerId,
    allEmployees
  )

  useEffect(() => {
    const currentManagerId = form.getValues(managerIdField) as string | undefined
    const nextManagerId = syncManagerIdForDepartment(
      currentManagerId,
      managers,
      allEmployees
    )
    if (nextManagerId !== (currentManagerId ?? "")) {
      form.setValue(managerIdField, nextManagerId, { shouldValidate: true })
    }
  }, [allEmployees, department, form, managerIdField, managers])

  return (
    <>
      <FormSelectField
        name={managerIdField}
        label="Supervisor / Manager"
        options={
          managerOptions.length > 0
            ? managerOptions
            : [{ value: "", label: "No managers available" }]
        }
        placeholder="Select manager"
        required
      />

      <div className="space-y-2">
        <Label>Manager email</Label>
        <Input
          readOnly
          value={manager?.contact.email ?? ""}
          placeholder="Auto-populated from selection"
          className="bg-muted/40"
        />
      </div>

      <FormField
        control={form.control}
        name={managerIdField}
        render={() => (
          <FormItem className="sm:col-span-2">
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
