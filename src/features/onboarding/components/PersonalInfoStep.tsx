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
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { OnboardingFormSection, OnboardingStepShell } from "./OnboardingStepShell"

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
]

const maritalOptions = [
  { value: "", label: "Select status" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
]

const step = ONBOARDING_STEPS[0]

export function PersonalInfoStep() {
  const form = useFormContext<OnboardingFormData>()

  return (
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description="HR-owned identity and work email. Contact details are collected in employee welcome."
    >
      <OnboardingFormSection title="Identity">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="hidden sm:block" aria-hidden />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="suffix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suffix</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jr., III" className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelectField<OnboardingFormData>
          name="gender"
          label="Gender"
          options={genderOptions}
        />
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelectField<OnboardingFormData>
          name="maritalStatus"
          label="Marital status"
          options={maritalOptions}
        />
      </OnboardingFormSection>

      <OnboardingFormSection title="Work contact">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Work email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
