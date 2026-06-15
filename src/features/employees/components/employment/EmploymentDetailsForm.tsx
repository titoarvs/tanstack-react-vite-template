import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormSelectField } from "@/components/ui/form-select-field"
import { Input } from "@/components/ui/input"
import {
  BUSINESS_UNITS,
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  getJobTitlesForDepartment,
  getPositionsForDepartment,
  ORG_LEVELS,
  WORK_LOCATIONS,
} from "../../data/masterData"
import {
  ACTIVE_STATUS_DETAILS,
  INACTIVE_STATUS_DETAILS,
} from "../../data/masterData"
import type { EmploymentEditFormData } from "../../schemas/employmentEditSchema"
import { ManagerDetailsFields } from "./ManagerDetailsFields"
import { ProbationDatesDisplay } from "./ProbationDatesDisplay"

const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }))
const employmentTypeOptions = EMPLOYMENT_TYPES.map(t => ({
  value: t.value,
  label: t.label,
}))
const workLocationOptions = WORK_LOCATIONS.map(w => ({
  value: w.value,
  label: w.label,
}))
const statusOptions = EMPLOYEE_STATUSES.map(s => ({
  value: s.value,
  label: s.label,
}))
const orgLevelOptions = ORG_LEVELS.map(level => ({ value: level, label: level }))
const businessUnitOptions = BUSINESS_UNITS.map(unit => ({
  value: unit,
  label: unit,
}))
const isManagerOptions = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
]

export function EmploymentDetailsForm({
  excludeEmployeeId,
}: {
  excludeEmployeeId?: string
}) {
  const form = useFormContext<EmploymentEditFormData>()
  const department = form.watch("department")
  const status = form.watch("status")

  const positionOptions = getPositionsForDepartment(department).map(p => ({
    value: p,
    label: p,
  }))
  const jobTitleOptions = getJobTitlesForDepartment(department).map(t => ({
    value: t,
    label: t,
  }))
  const statusDetailOptions =
    status === "inactive"
      ? INACTIVE_STATUS_DETAILS.map(s => ({ value: s.value, label: s.label }))
      : ACTIVE_STATUS_DETAILS.map(s => ({ value: s.value, label: s.label }))

  useEffect(() => {
    const currentPosition = form.getValues("position")
    if (currentPosition && !positionOptions.some(o => o.value === currentPosition)) {
      form.setValue("position", positionOptions[0]?.value ?? "")
    }
    const currentJobTitle = form.getValues("jobTitle")
    if (currentJobTitle && !jobTitleOptions.some(o => o.value === currentJobTitle)) {
      form.setValue("jobTitle", jobTitleOptions[0]?.value ?? "")
    }
  }, [department, form, positionOptions, jobTitleOptions])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-lg border border-border/80 bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Role & organisation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelectField<EmploymentEditFormData>
            name="department"
            label="Department"
            options={departmentOptions}
            required
          />
          <FormSelectField<EmploymentEditFormData>
            name="position"
            label="Position"
            options={positionOptions}
            required
          />
          <FormSelectField<EmploymentEditFormData>
            name="jobTitle"
            label="Job title"
            options={jobTitleOptions}
            required
          />
          <FormField
            control={form.control}
            name="isManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is manager?</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                    value={field.value ? "true" : "false"}
                    onChange={e => field.onChange(e.target.value === "true")}
                  >
                    {isManagerOptions.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ManagerDetailsFields excludeEmployeeId={excludeEmployeeId} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border/80 bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Organisation structure</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelectField<EmploymentEditFormData>
            name="orgLevel"
            label="Organization level"
            options={[{ value: "", label: "Not set" }, ...orgLevelOptions]}
          />
          <FormSelectField<EmploymentEditFormData>
            name="businessUnit"
            label="Business unit"
            options={[{ value: "", label: "Not set" }, ...businessUnitOptions]}
          />
          <FormField
            control={form.control}
            name="costCenter"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Cost center</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSelectField<EmploymentEditFormData>
            name="workLocation"
            label="Work location"
            options={workLocationOptions}
            required
          />
          <FormSelectField<EmploymentEditFormData>
            name="employmentType"
            label="Employment type"
            options={employmentTypeOptions}
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border/80 bg-card p-4 lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground">Employment status & dates</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormSelectField<EmploymentEditFormData>
            name="status"
            label="Employee status"
            options={statusOptions}
            required
          />
          <FormSelectField<EmploymentEditFormData>
            name="statusDetail"
            label="Status detail"
            options={[{ value: "", label: "Not set" }, ...statusDetailOptions]}
          />
          <FormField
            control={form.control}
            name="hireDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Hire date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ProbationDatesDisplay />
          <FormField
            control={form.control}
            name="contractSignedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Date contract signed</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract start</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract end</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terminationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Termination / resignation date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="separationReason"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Separation reason</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
