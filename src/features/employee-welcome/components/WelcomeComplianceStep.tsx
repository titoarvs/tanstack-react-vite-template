import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { getCompliancePolicyBody } from "@/features/compliance/lib/compliancePolicyTemplates"
import { getFirstDayRequirements } from "@/features/employees/lib/documentRequirementPolicy"
import { isSignaturePadFilled } from "@/features/employees/lib/signaturePadUtils"
import { DocumentSignModal } from "@/features/employees/components/DocumentSignModal"
import type { Employee } from "@/features/employees/types"
import {
  DOCUMENT_TYPE_LABELS,
  type DocumentType,
} from "@/features/employees/types/documents"
import type { ProfileOnboardingFormData } from "../schemas/profileOnboardingSchema"
import { PROFILE_ONBOARDING_STEPS } from "../lib/profileOnboardingSteps"

const step = PROFILE_ONBOARDING_STEPS.find(s => s.id === "compliance")!

interface WelcomeComplianceStepProps {
  employee: Employee
}

function ComplianceSignatureField({
  label,
  policyType,
  fieldName,
  signed,
}: {
  label: string
  policyType: DocumentType
  fieldName:
    | "acknowledgeNda"
    | "acknowledgeNonCompete"
    | "acknowledgeAcceptableUse"
  signed: boolean
}) {
  const form = useFormContext<ProfileOnboardingFormData>()
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [signedAt, setSignedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const applySignature = () => {
    if (!isSignaturePadFilled(signatureDataUrl)) {
      setError("Draw your signature to acknowledge")
      throw new Error("validation")
    }
    form.clearErrors(fieldName)
    form.setValue(fieldName, true, { shouldValidate: true })
    setSignedAt(new Date().toISOString())
    setError(null)
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={() => (
        <FormItem className="mb-1">
          <DocumentSignModal
            title={label}
            description="Review the policy, then sign at the bottom of the modal."
            documentContent={getCompliancePolicyBody(policyType)}
            signed={signed}
            signedInfo={
              signed
                ? {
                    signedAt: signedAt ?? undefined,
                    signatureDataUrl: signatureDataUrl ?? undefined,
                  }
                : undefined
            }
            signatureDataUrl={signatureDataUrl}
            onSignatureChange={setSignatureDataUrl}
            onSubmit={applySignature}
            submitError={error}
            submitLabel="Acknowledge with signature"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function WelcomeComplianceStep({
  employee,
}: WelcomeComplianceStepProps) {
  const form = useFormContext<ProfileOnboardingFormData>()
  const ctx = {
    employmentType: employee.employmentType,
    workLocation: employee.workLocation,
    maritalStatus: employee.demographics?.maritalStatus,
  }
  const requirements = getFirstDayRequirements(ctx)

  return (
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description={step.description}
    >
      <OnboardingFormSection title="First-day cybersecurity & compliance">
        <div className="flex flex-col gap-3">
          <p className="mb-4 text-sm text-muted-foreground">
            Open each policy to review and sign in the modal before accessing
            the workspace.
          </p>
          <div className="flex flex-col gap-3">
            {requirements.map(req => {
              const fieldName =
                req.type === "nda"
                  ? "acknowledgeNda"
                  : req.type === "non_compete"
                    ? "acknowledgeNonCompete"
                    : "acknowledgeAcceptableUse"

              return (
                <ComplianceSignatureField
                  key={req.type}
                  label={DOCUMENT_TYPE_LABELS[req.type]}
                  policyType={req.type}
                  fieldName={fieldName}
                  signed={form.watch(fieldName) === true}
                />
              )
            })}
          </div>
        </div>
      </OnboardingFormSection>
    </OnboardingStepShell>
  )
}
