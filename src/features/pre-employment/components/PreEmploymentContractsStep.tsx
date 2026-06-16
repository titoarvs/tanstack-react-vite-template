import { useFormContext } from "react-hook-form"
import {
  OnboardingFormSection,
  OnboardingStepShell,
} from "@/features/onboarding/components/OnboardingStepShell"
import { ContractSigningPanel } from "@/features/employees/components/ContractSigningPanel"
import {
  buildRequirementContextFromInvite,
  contractTypeFromDocumentType,
  getContractSigningRequirements,
} from "@/features/employees/lib/documentRequirementPolicy"
import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import type {
  ContractSignatureRecord,
  PreEmploymentFormData,
  PreEmploymentInvite,
} from "../types"

const step = PRE_EMPLOYMENT_STEPS[3]

interface PreEmploymentContractsStepProps {
  invite: PreEmploymentInvite
}

export function PreEmploymentContractsStep({ invite }: PreEmploymentContractsStepProps) {
  const form = useFormContext<PreEmploymentFormData>()
  const signatures = form.watch("contractSignatures") ?? []
  const ctx = buildRequirementContextFromInvite(invite)
  const requirements = getContractSigningRequirements(ctx).filter(
    r => r.priority === "required"
  )

  const upsertSignature = (record: ContractSignatureRecord) => {
    const next = signatures.filter(s => s.contractType !== record.contractType)
    next.push(record)
    form.setValue("contractSignatures", next, { shouldValidate: true })
  }

  return (
    <OnboardingStepShell icon={step.icon} title={step.label} description={step.description}>
      <OnboardingFormSection title="Employment contracts">
        <div className="flex flex-col gap-3">
          {requirements.map(req => {
            const contractType = contractTypeFromDocumentType(req.type)
            if (!contractType) return null
            const existing = signatures.find(s => s.contractType === contractType)
            return (
              <ContractSigningPanel
                key={req.type}
                contractType={contractType}
                invite={invite}
                signature={existing}
                onSign={upsertSignature}
              />
            )
          })}
        </div>
      </OnboardingFormSection>
      {form.formState.errors.contractSignatures && (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.contractSignatures.message}
        </p>
      )}
    </OnboardingStepShell>
  )
}
