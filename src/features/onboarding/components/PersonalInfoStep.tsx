import { RefreshCw, Upload } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormSelectField } from "@/components/ui/form-select-field"
import { Input } from "@/components/ui/input"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { useOnboardingWizardContext } from "../context/OnboardingWizardContext"
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

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const step = ONBOARDING_STEPS[0]

export function PersonalInfoStep() {
  const { regenerateEmployeeId, isRegeneratingId } = useOnboardingWizardContext()
  const form = useFormContext<OnboardingFormData>()
  const photoUrl = form.watch("photoUrl")
  const fullName = `${form.watch("firstName")} ${form.watch("lastName")}`.trim() || "Employee"
  const photoError = form.formState.errors.photoUrl?.message

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      form.setError("photoUrl", { message: "Please upload an image file" })
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      form.setError("photoUrl", { message: "Image must be under 2MB" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      form.setValue("photoUrl", reader.result as string, { shouldValidate: true })
      form.clearErrors("photoUrl")
    }
    reader.readAsDataURL(file)
  }

  return (
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description={step.description}
    >
      <OnboardingFormSection title="Identity">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FormLabel>Employee ID</FormLabel>
                <Badge variant="secondary" className="text-[10px] font-normal">
                  Auto-generated
                </Badge>
              </div>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    className="bg-muted/30 font-mono text-sm"
                    aria-readonly
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  disabled={isRegeneratingId}
                  onClick={regenerateEmployeeId}
                  aria-label="Generate new employee ID"
                >
                  <RefreshCw
                    className={cn("h-4 w-4", isRegeneratingId && "animate-spin")}
                  />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Reserved for this draft until the employee is created in the directory.
              </p>
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

      <OnboardingFormSection title="Contact">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>

      <section className="rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Profile photo
        </h3>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <EmployeeAvatar src={photoUrl} name={fullName} className="h-20 w-20 shrink-0 ring-2 ring-border" />
          <label
            className={cn(
              "flex min-h-[7rem] w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
              photoError
                ? "border-destructive/50 bg-destructive/5"
                : "border-border bg-card hover:border-success/50 hover:bg-accent/30"
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Click to upload or drag a photo
            </span>
            <span className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="sr-only"
            />
          </label>
        </div>
        {photoError && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {photoError}
          </p>
        )}
      </section>
    </OnboardingStepShell>
  )
}
