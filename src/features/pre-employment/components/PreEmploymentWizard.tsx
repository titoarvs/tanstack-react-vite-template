import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import {
  contactStepSchema,
  emergencyStepSchema,
  policiesStepSchema,
  preEmploymentFormSchema,
} from "../schemas/preEmploymentSchema"
import {
  useSavePreEmploymentProgress,
  useSubmitPreEmploymentForm,
} from "../hooks/usePreEmployment"
import { normalizeAddressInput } from "@/features/employees/lib/address"
import { PRE_EMPLOYMENT_STEP_COUNT } from "../lib/preEmploymentSteps"
import type { PreEmploymentFormData, PreEmploymentInvite } from "../types"
import { InviteSummary } from "./InviteSummary"
import { PreEmploymentContactStep } from "./PreEmploymentContactStep"
import { PreEmploymentEmergencyStep } from "./PreEmploymentEmergencyStep"
import { PreEmploymentPoliciesStep } from "./PreEmploymentPoliciesStep"
import { PreEmploymentReviewStep } from "./PreEmploymentReviewStep"
import { PreEmploymentStepper } from "./PreEmploymentStepper"

function applyZodErrors(
  form: ReturnType<typeof useForm<PreEmploymentFormData>>,
  error: import("zod").ZodError
) {
  error.issues.forEach(issue => {
    const path = issue.path[0] as keyof PreEmploymentFormData
    if (path) form.setError(path, { message: issue.message })
  })
}

function buildDefaultValues(invite: PreEmploymentInvite): PreEmploymentFormData {
  const p = invite.candidatePayload
  return {
    phone: p.phone ?? "",
    address: normalizeAddressInput(
      p.address,
      (p as { province?: string }).province
    ),
    dateOfBirth: p.dateOfBirth ?? "",
    gender: p.gender ?? "",
    nationality: p.nationality ?? "",
    maritalStatus: p.maritalStatus ?? "",
    emergencyContactName: p.emergencyContactName ?? "",
    emergencyContactPhone: p.emergencyContactPhone ?? "",
    emergencyContactRelationship: p.emergencyContactRelationship ?? "",
    preferredName: p.preferredName ?? "",
    personalEmail: p.personalEmail ?? "",
    photoUrl: p.photoUrl ?? "",
    acknowledgeHandbook: p.acknowledgeHandbook ?? false,
    acknowledgePrivacy: p.acknowledgePrivacy ?? false,
  }
}

interface PreEmploymentWizardProps {
  invite: PreEmploymentInvite
  token: string
}

export function PreEmploymentWizard({ invite, token }: PreEmploymentWizardProps) {
  const [step, setStep] = useState(0)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()
  const saveProgress = useSavePreEmploymentProgress(token)
  const submitForm = useSubmitPreEmploymentForm(token)

  const defaultValues = useMemo(() => buildDefaultValues(invite), [invite])

  const form = useForm<PreEmploymentFormData>({
    resolver: zodResolver(preEmploymentFormSchema),
    defaultValues,
    mode: "onBlur",
  })

  const goToStep = (index: number) => {
    if (index < 0 || index >= PRE_EMPLOYMENT_STEP_COUNT) return
    setSubmitError(null)
    setStep(index)
  }

  const persistStep = async () => {
    await saveProgress.mutateAsync(form.getValues())
  }

  const goNext = async () => {
    setSubmitError(null)
    const schema =
      step === 0 ? contactStepSchema : step === 1 ? emergencyStepSchema : policiesStepSchema
    const result = schema.safeParse(form.getValues())
    if (!result.success) {
      applyZodErrors(form, result.error)
      return
    }
    try {
      await persistStep()
    } catch {
      /* non-blocking for mock */
    }
    const next = Math.min(step + 1, PRE_EMPLOYMENT_STEP_COUNT - 1)
    setMaxReachedStep(max => Math.max(max, next))
    setStep(next)
  }

  const onSubmit = form.handleSubmit(async data => {
    setSubmitError(null)
    try {
      await submitForm.mutateAsync(data)
      navigate({ to: "/join/$token/submitted", params: { token } })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not submit your forms")
    }
  })

  const isLastStep = step === PRE_EMPLOYMENT_STEP_COUNT - 1

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <InviteSummary invite={invite} />

        <PreEmploymentStepper
          currentStep={step}
          maxReachedStep={maxReachedStep}
          onStepClick={goToStep}
        />

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {step === 0 && <PreEmploymentContactStep />}
            {step === 1 && <PreEmploymentEmergencyStep />}
            {step === 2 && <PreEmploymentPoliciesStep invite={invite} />}
            {step === 3 && (
              <PreEmploymentReviewStep
                invite={invite}
                data={form.getValues()}
                onEditStep={goToStep}
              />
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
            )}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => (step === 0 ? undefined : goToStep(step - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {submitError && (
                <p className="text-center text-sm text-destructive sm:mr-4 sm:text-right" role="alert">
                  {submitError}
                </p>
              )}
              {!isLastStep ? (
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={goNext}
                  disabled={saveProgress.isPending}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={submitForm.isPending}
                >
                  {submitForm.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit to HR
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
