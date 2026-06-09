import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  computeProbationEnd,
  computeRegularizationDate,
} from "../../lib/employeeCalculations"

interface ProbationDatesDisplayProps {
  hireDateField?: string
  probationEndDateField?: string
  regularizationDateField?: string
}

export function ProbationDatesDisplay({
  hireDateField = "hireDate",
  probationEndDateField = "probationEndDate",
  regularizationDateField = "regularizationDate",
}: ProbationDatesDisplayProps) {
  const form = useFormContext<Record<string, string>>()
  const hireDate = form.watch(hireDateField)

  useEffect(() => {
    if (!hireDate) {
      form.setValue(probationEndDateField, "")
      form.setValue(regularizationDateField, "")
      return
    }
    const probationEnd = computeProbationEnd(hireDate) ?? ""
    const regularization = computeRegularizationDate(hireDate, probationEnd) ?? ""
    form.setValue(probationEndDateField, probationEnd)
    form.setValue(regularizationDateField, regularization)
  }, [form, hireDate, hireDateField, probationEndDateField, regularizationDateField])

  return (
    <>
      <FormField
        control={form.control}
        name={probationEndDateField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>End of probation</FormLabel>
            <FormControl>
              <Input
                type="date"
                readOnly
                {...field}
                value={field.value ?? ""}
                className="bg-muted/40"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={regularizationDateField}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Regularization date</FormLabel>
            <FormControl>
              <Input
                type="date"
                readOnly
                {...field}
                value={field.value ?? ""}
                className="bg-muted/40"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}
