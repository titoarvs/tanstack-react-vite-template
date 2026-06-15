import { Upload } from "lucide-react"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { RequiredMark } from "@/components/ui/required-mark"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import type { PreEmploymentFormData } from "../types"
import { getPreEmploymentFullName } from "../types"
import type { PreEmploymentInvite } from "../types"

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const step = PRE_EMPLOYMENT_STEPS[2]

interface PreEmploymentPoliciesStepProps {
  invite: PreEmploymentInvite
}

export function PreEmploymentPoliciesStep({ invite }: PreEmploymentPoliciesStepProps) {
  const form = useFormContext<PreEmploymentFormData>()
  const photoUrl = form.watch("photoUrl")
  const displayName =
    form.watch("preferredName")?.trim() || getPreEmploymentFullName(invite)

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
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      <OnboardingFormSection title="Profile photo (optional)">
        <FormField
          control={form.control}
          name="photoUrl"
          render={() => (
            <FormItem className="sm:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <EmployeeAvatar name={displayName} src={photoUrl} className="h-16 w-16" />
                <label
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30",
                    form.formState.errors.photoUrl && "border-destructive"
                  )}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Upload photo</span>
                  <span className="mt-1 text-xs text-muted-foreground">PNG or JPG, max 2MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhoto}
                  />
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </OnboardingFormSection>

      <OnboardingFormSection title="Required acknowledgements">
        <FormField
          control={form.control}
          name="acknowledgeHandbook"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 sm:col-span-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={e => field.onChange(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal leading-snug">
                  I have read and agree to the employee handbook <RequiredMark />
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acknowledgePrivacy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 sm:col-span-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={e => field.onChange(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal leading-snug">
                  I acknowledge how my personal data will be processed <RequiredMark />
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
