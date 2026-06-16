import { useFormContext } from "react-hook-form"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import {
  buildRequirementContextFromInvite,
  getUploadRequirementsForPortal,
} from "@/features/employees/lib/documentRequirementPolicy"
import {
  DocumentUploadField,
} from "@/features/employees/components/DocumentUploadField"
import { groupRequirementsByCategory } from "../lib/preEmploymentDocuments"
import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import type { PreEmploymentFormData, PreEmploymentInvite } from "../types"

const step = PRE_EMPLOYMENT_STEPS[2]

interface PreEmploymentDocumentsStepProps {
  invite: PreEmploymentInvite
}

export function PreEmploymentDocumentsStep({ invite }: PreEmploymentDocumentsStepProps) {
  const form = useFormContext<PreEmploymentFormData>()
  const maritalStatus = form.watch("maritalStatus")
  const uploadedDocuments = form.watch("uploadedDocuments") ?? []

  const ctx = buildRequirementContextFromInvite({
    ...invite,
    candidatePayload: { maritalStatus },
  })
  const requirements = getUploadRequirementsForPortal(ctx)
  const grouped = groupRequirementsByCategory(requirements)

  const setDocuments = (docs: PreEmploymentFormData["uploadedDocuments"]) => {
    form.setValue("uploadedDocuments", docs, { shouldValidate: true })
  }

  return (
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      {Array.from(grouped.entries()).map(([category, reqs]) => (
        <OnboardingFormSection key={category} title={category}>
          <div className="space-y-3">
            {reqs.map(req => (
              <DocumentUploadField
                key={`${req.type}-${req.phase}`}
                requirement={req}
                documents={uploadedDocuments}
                onChange={setDocuments}
              />
            ))}
          </div>
        </OnboardingFormSection>
      ))}
      {form.formState.errors.uploadedDocuments && (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.uploadedDocuments.message}
        </p>
      )}
    </OnboardingStepShell>
  )
}
