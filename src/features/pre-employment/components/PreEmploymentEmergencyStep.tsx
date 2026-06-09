import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneField } from "@/features/employees/components/phone/PhoneField"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import type { PreEmploymentFormData } from "../types"

const step = PRE_EMPLOYMENT_STEPS[1]

export function PreEmploymentEmergencyStep() {
  const form = useFormContext<PreEmploymentFormData>()

  return (
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      <OnboardingFormSection title="Emergency contact">
        <FormField
          control={form.control}
          name="emergencyContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PhoneField
          name="emergencyContactPhone"
          label="Contact phone"
          placeholder="912 345 6789"
        />
        <FormField
          control={form.control}
          name="emergencyContactRelationship"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>

      <OnboardingFormSection title="Personal (optional)">
        <FormField
          control={form.control}
          name="preferredName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Optional"
                  className="bg-card"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
