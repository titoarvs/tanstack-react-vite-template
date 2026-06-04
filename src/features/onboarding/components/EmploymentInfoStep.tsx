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
import { DEPARTMENTS, OFFICE_BRANCHES } from "@/features/employees/api/employeeApi"
import { useManagers } from "@/features/employees/hooks/useEmployees"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { OnboardingFormSection, OnboardingStepShell } from "./OnboardingStepShell"

const departmentOptions = [
  ...DEPARTMENTS.map(d => ({ value: d, label: d })),
  { value: "Other", label: "Other" },
]

const employmentTypeOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
]

const branchOptions = OFFICE_BRANCHES.map(b => ({ value: b, label: b }))
const step = ONBOARDING_STEPS[1]

export function EmploymentInfoStep() {
  const form = useFormContext<OnboardingFormData>()
  const employmentType = form.watch("employmentType")
  const department = form.watch("department")
  const managers = useManagers()

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
        {department === "Other" && (
          <FormField
            control={form.control}
            name="departmentOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-card" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelectField<OnboardingFormData>
          name="managerId"
          label="Manager"
          options={managerOptions}
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
        {employmentType === "full-time" && (
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
