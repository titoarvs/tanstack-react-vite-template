import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { formatAddress } from "@/features/employees/lib/address"
import { formatDisplayPhone } from "@/features/employees/lib/phone"
import type { Employee } from "@/features/employees/types"
import { getFullName } from "@/features/employees/types"
import type { ProfileOnboardingStepDef } from "../lib/profileOnboardingSteps"
import { isPreEmploymentWelcomePath } from "../lib/profileOnboardingPolicy"
import type { ProfileOnboardingFormData } from "../schemas/profileOnboardingSchema"

interface WelcomeReviewStepProps {
  employee: Employee
  onEditStep: (index: number) => void
  steps: ProfileOnboardingStepDef[]
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2 last:border-0 sm:flex-row sm:justify-between">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  )
}

export function WelcomeReviewStep({ employee, onEditStep, steps }: WelcomeReviewStepProps) {
  const form = useFormContext<ProfileOnboardingFormData>()
  const values = form.getValues()
  const step = steps[steps.length - 1]
  const preEmploymentPath = isPreEmploymentWelcomePath(employee)

  const stepIndex = (id: ProfileOnboardingStepDef["id"]) =>
    steps.findIndex(s => s.id === id)

  return (
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      {!preEmploymentPath && (
        <>
          <OnboardingFormSection title="From HR">
            <dl className="sm:col-span-2">
              <ReviewRow label="Legal name" value={getFullName(employee)} />
              <ReviewRow label="Employee ID" value={employee.employeeId} />
              <ReviewRow
                label="Position"
                value={`${employee.position} · ${employee.department}`}
              />
              <ReviewRow label="Work email" value={employee.contact.email} />
            </dl>
          </OnboardingFormSection>

          <OnboardingFormSection title="Your updates">
            <dl className="sm:col-span-2">
              <ReviewRow
                label="Phone"
                value={formatDisplayPhone(values.phone) || values.phone}
              />
              <ReviewRow
                label="Address"
                value={formatAddress(values.address) || "Not provided"}
              />
              <ReviewRow
                label="Date of birth"
                value={values.dateOfBirth || "Not provided"}
              />
              <ReviewRow
                label="Emergency contact"
                value={
                  values.emergencyContactName
                    ? `${values.emergencyContactName}${values.emergencyContactPhone ? ` · ${formatDisplayPhone(values.emergencyContactPhone) || values.emergencyContactPhone}` : ""}`
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
              <ReviewRow
                label="Handbook"
                value={values.acknowledgeHandbook ? "Acknowledged" : "—"}
              />
            </dl>
          </OnboardingFormSection>
        </>
      )}

      <OnboardingFormSection title="First-day compliance">
        <dl className="sm:col-span-2">
          <ReviewRow
            label="Privacy notice"
            value={
              employee.compliance?.privacyConsentSigned
                ? `Acknowledged${employee.compliance.privacyConsentAt ? ` · ${new Date(employee.compliance.privacyConsentAt).toLocaleString()}` : ""}`
                : "—"
            }
          />
          <ReviewRow label="NDA" value={values.acknowledgeNda ? "Acknowledged" : "—"} />
          <ReviewRow
            label="Non-compete"
            value={values.acknowledgeNonCompete ? "Acknowledged" : "—"}
          />
          <ReviewRow
            label="Acceptable Use Policy"
            value={values.acknowledgeAcceptableUse ? "Acknowledged" : "—"}
          />
        </dl>
      </OnboardingFormSection>

      <div className="flex flex-wrap gap-2">
        {!preEmploymentPath && stepIndex("contact") >= 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(stepIndex("contact"))}
          >
            Edit contact
          </Button>
        )}
        {!preEmploymentPath && stepIndex("policies") >= 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(stepIndex("policies"))}
          >
            Edit policies
          </Button>
        )}
        {stepIndex("compliance") >= 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditStep(stepIndex("compliance"))}
          >
            Edit compliance
          </Button>
        )}
      </div>
    </OnboardingStepShell>
  )
}
