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
import { ManagerDetailsFields } from "@/features/employees/components/employment/ManagerDetailsFields"
import { ProbationDatesDisplay } from "@/features/employees/components/employment/ProbationDatesDisplay"
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  getJobTitlesForDepartment,
  getPositionsForDepartment,
  WORK_LOCATIONS,
} from "@/features/employees/data/masterData"
import { getCreateFormStatusDetailOptions } from "@/features/employees/lib/employmentStatus"
import { useManatalPrefill } from "@/features/integrations/manatal/useManatalPrefill"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { OnboardingFormSection, OnboardingStepShell } from "./OnboardingStepShell"

const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }))
const employmentTypeOptions = EMPLOYMENT_TYPES.map(t => ({
  value: t.value,
  label: t.label,
}))
const workLocationOptions = WORK_LOCATIONS.map(w => ({
  value: w.value,
  label: w.label,
}))
const statusDetailOptions = getCreateFormStatusDetailOptions()
const isManagerOptions = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
]
const step = ONBOARDING_STEPS[1]

export function EmploymentInfoStep() {
  const form = useFormContext<OnboardingFormData>()
  const department = form.watch("department")
  const manatalPrefill = useManatalPrefill()

  const positionOptions = getPositionsForDepartment(department).map(p => ({
    value: p,
    label: p,
  }))
  const jobTitleOptions = getJobTitlesForDepartment(department).map(t => ({
    value: t,
    label: t,
  }))

  useEffect(() => {
    const defaults = manatalPrefill
    const current = form.getValues()
    if (!current.position && defaults.position) {
      form.setValue("position", defaults.position)
    }
    if (!current.jobTitle && defaults.jobTitle) {
      form.setValue("jobTitle", defaults.jobTitle)
    }
    if (!current.workLocation && defaults.workLocation) {
      form.setValue("workLocation", defaults.workLocation)
    }
    if (!current.employmentType && defaults.employmentType) {
      form.setValue("employmentType", defaults.employmentType)
    }
    if (!current.statusDetail && defaults.statusDetail) {
      form.setValue("statusDetail", defaults.statusDetail)
    }
    if (!current.contractSignedDate && defaults.contractSignedDate) {
      form.setValue("contractSignedDate", defaults.contractSignedDate)
    }
  }, [form, manatalPrefill])

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
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description={step.description}
    >
      <OnboardingFormSection title="Role & organisation">
        <FormSelectField<OnboardingFormData>
          name="department"
          label="Department"
          options={departmentOptions}
          required
        />
        <FormSelectField<OnboardingFormData>
          name="position"
          label="Position"
          options={positionOptions}
          required
        />
        <FormSelectField<OnboardingFormData>
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
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
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
      </OnboardingFormSection>

      <OnboardingFormSection title="Manager details">
        <ManagerDetailsFields />
      </OnboardingFormSection>

      <OnboardingFormSection title="Employment terms">
        <FormSelectField<OnboardingFormData>
          name="workLocation"
          label="Work location"
          options={workLocationOptions}
          required
        />
        <FormSelectField<OnboardingFormData>
          name="employmentType"
          label="Employment type"
          options={employmentTypeOptions}
          required
        />
        <FormSelectField<OnboardingFormData>
          name="statusDetail"
          label="Active status"
          options={statusDetailOptions}
          required
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
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
