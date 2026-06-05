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
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import type { PreEmploymentFormData } from "../types"

const genderOptions = [
  { value: "", label: "Select gender (optional)" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
]

const maritalOptions = [
  { value: "", label: "Select status (optional)" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
]

const step = PRE_EMPLOYMENT_STEPS[0]

export function PreEmploymentContactStep() {
  const form = useFormContext<PreEmploymentFormData>()

  return (
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      <OnboardingFormSection title="Contact">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile phone *</FormLabel>
              <FormControl>
                <Input {...field} type="tel" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Home address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>

      <OnboardingFormSection title="Demographics (optional)">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelectField name="gender" label="Gender" options={genderOptions} />
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelectField name="maritalStatus" label="Civil status" options={maritalOptions} />
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
