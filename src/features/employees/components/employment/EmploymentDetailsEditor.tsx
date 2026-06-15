import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { employeeToEmploymentForm } from "../../lib/employmentForm"
import { useUpdateEmployeeEmployment } from "../../hooks/useEmployees"
import {
  employmentEditSchema,
  type EmploymentEditFormData,
} from "../../schemas/employmentEditSchema"
import type { Employee } from "../../types"
import { EmploymentDetailsForm } from "./EmploymentDetailsForm"

interface EmploymentDetailsEditorProps {
  employee: Employee
}

export function EmploymentDetailsEditor({ employee }: EmploymentDetailsEditorProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const updateEmployment = useUpdateEmployeeEmployment(employee.id)

  const form = useForm<EmploymentEditFormData>({
    resolver: zodResolver(employmentEditSchema),
    defaultValues: employeeToEmploymentForm(employee),
    mode: "onBlur",
  })

  const onSubmit = form.handleSubmit(async values => {
    setSubmitError(null)
    try {
      await updateEmployment.mutateAsync(values)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save employment details."
      )
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <EmploymentDetailsForm excludeEmployeeId={employee.id} />
        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset(employeeToEmploymentForm(employee))
              setSubmitError(null)
            }}
            disabled={updateEmployment.isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={updateEmployment.isPending}>
            {updateEmployment.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save employment details"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
