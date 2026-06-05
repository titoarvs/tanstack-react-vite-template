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
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  getPositionsForDepartment,
  OFFICE_BRANCHES,
  ORG_LEVELS,
  WORK_LOCATIONS,
} from "@/features/employees/api/employeeApi"
import { useManagers } from "@/features/employees/hooks/useEmployees"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { OnboardingFormSection, OnboardingStepShell } from "./OnboardingStepShell"

const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }))
const employmentTypeOptions = EMPLOYMENT_TYPES.map(t => ({
  value: t.value,
  label: t.label,
}))
const branchOptions = OFFICE_BRANCHES.map(b => ({ value: b, label: b }))
const orgLevelOptions = ORG_LEVELS.map(o => ({ value: o, label: o }))
const workLocationOptions = WORK_LOCATIONS.map(w => ({
  value: w.value,
  label: w.label,
}))
const step = ONBOARDING_STEPS[1]

export function EmploymentInfoStep() {
  const form = useFormContext<OnboardingFormData>()
  const employmentType = form.watch("employmentType")
  const department = form.watch("department")
  const managers = useManagers()

  const positionOptions = getPositionsForDepartment(department).map(p => ({
    value: p,
    label: p,
  }))

  useEffect(() => {
    const current = form.getValues("position")
    if (current && !positionOptions.some(o => o.value === current)) {
      form.setValue("position", positionOptions[0]?.value ?? "")
    }
  }, [department, form, positionOptions])

  const managerOptions = [
    { value: "", label: "No manager" },
    ...managers.map(m => ({
      value: m.id,
      label: `${m.firstName} ${m.lastName} — ${m.position}`,
    })),
  ]

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
        />
        <FormSelectField<OnboardingFormData>
          name="position"
          label="Position"
          options={positionOptions}
        />
        <FormSelectField<OnboardingFormData>
          name="managerId"
          label="Manager"
          options={managerOptions}
        />
        <FormSelectField<OnboardingFormData>
          name="orgLevel"
          label="Organization level"
          options={orgLevelOptions}
        />
        <FormSelectField<OnboardingFormData>
          name="workLocation"
          label="Work location"
          options={workLocationOptions}
        />
        <FormSelectField<OnboardingFormData>
          name="employmentType"
          label="Employment type"
          options={employmentTypeOptions}
        />
        <FormSelectField<OnboardingFormData>
          name="officeBranch"
          label="Office branch"
          options={branchOptions}
        />
      </OnboardingFormSection>

      <OnboardingFormSection title="Dates & lifecycle">
        <FormField
          control={form.control}
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hire date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(employmentType === "regular" || employmentType === "probationary") && (
          <FormField
            control={form.control}
            name="probationEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probation end date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(employmentType === "contract" || employmentType === "internship") && (
          <>
            <FormField
              control={form.control}
              name="contractStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract start date</FormLabel>
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
                  <FormLabel>Contract end date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-card" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
