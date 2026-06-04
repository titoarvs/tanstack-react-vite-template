import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import type { Employee } from "@/features/employees/types"
import { getFullName } from "@/features/employees/types"
import { PROFILE_ONBOARDING_STEPS } from "../lib/profileOnboardingSteps"
import type { ProfileOnboardingFormData } from "../schemas/profileOnboardingSchema"

const step = PROFILE_ONBOARDING_STEPS[2]

interface WelcomeReviewStepProps {
  employee: Employee
  onEditStep: (index: number) => void
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2 last:border-0 sm:flex-row sm:justify-between">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  )
}

export function WelcomeReviewStep({ employee, onEditStep }: WelcomeReviewStepProps) {
  const form = useFormContext<ProfileOnboardingFormData>()
  const values = form.getValues()

  return (
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description={step.description}
    >
      <OnboardingFormSection title="From HR">
        <dl className="sm:col-span-2">
          <ReviewRow label="Legal name" value={getFullName(employee)} />
          <ReviewRow label="Employee ID" value={employee.employeeId} />
          <ReviewRow label="Position" value={`${employee.position} · ${employee.department}`} />
          <ReviewRow label="Work email" value={employee.contact.email} />
        </dl>
      </OnboardingFormSection>

      <OnboardingFormSection title="Your updates">
        <dl className="sm:col-span-2">
          <ReviewRow label="Phone" value={values.phone} />
          <ReviewRow label="Address" value={values.address?.trim() || "Not provided"} />
          <ReviewRow
            label="Date of birth"
            value={values.dateOfBirth || "Not provided"}
          />
          <ReviewRow
            label="Emergency contact"
            value={
              values.emergencyContactName
                ? `${values.emergencyContactName}${values.emergencyContactPhone ? ` · ${values.emergencyContactPhone}` : ""}`
                : "Not provided"
            }
          />
          <ReviewRow
            label="Preferred name"
            value={values.preferredName?.trim() || "Not provided"}
          />
          <ReviewRow
            label="Personal email"
            value={values.personalEmail?.trim() || "Not provided"}
          />
          <ReviewRow
            label="Photo"
            value={values.photoUrl ? "Uploaded" : "Not provided"}
          />
          <ReviewRow label="Handbook" value={values.acknowledgeHandbook ? "Acknowledged" : "—"} />
          <ReviewRow label="Privacy" value={values.acknowledgePrivacy ? "Acknowledged" : "—"} />
        </dl>
      </OnboardingFormSection>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onEditStep(0)}>
          Edit contact
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onEditStep(1)}>
          Edit policies
        </Button>
      </div>
    </OnboardingStepShell>
  )
}
