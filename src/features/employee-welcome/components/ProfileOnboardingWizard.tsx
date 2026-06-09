import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useQueryClient } from "@tanstack/react-query"
import { employeeKeys } from "@/features/employees/hooks/useEmployees"
import type { Employee } from "@/features/employees/types"
import { cn } from "@/lib/utils"
import { completeProfileOnboarding } from "../api/profileOnboardingApi"
import { PROFILE_ONBOARDING_STEP_COUNT, PROFILE_ONBOARDING_STEPS } from "../lib/profileOnboardingSteps"
import {
  contactStepSchema,
  policiesStepSchema,
  profileOnboardingSchema,
  type ProfileOnboardingFormData,
} from "../schemas/profileOnboardingSchema"
import { ContactDetailsStep } from "./ContactDetailsStep"
import { HrAssignedSummary } from "./HrAssignedSummary"
import { PoliciesStep } from "./PoliciesStep"
import { ProfileOnboardingProgress } from "./ProfileOnboardingStepper"
import { WelcomeReviewStep } from "./WelcomeReviewStep"

function applyZodErrors(
  form: ReturnType<typeof useForm<ProfileOnboardingFormData>>,
  error: import("zod").ZodError
) {
  error.issues.forEach(issue => {
    const path = issue.path[0] as keyof ProfileOnboardingFormData
    if (path) form.setError(path, { message: issue.message })
  })
}

function buildDefaultValues(employee: Employee): ProfileOnboardingFormData {
  return {
    phone: employee.contact.phone ?? "",
    address: employee.contact.address ?? "",
    dateOfBirth: employee.demographics.dateOfBirth ?? "",
    gender: employee.demographics.gender ?? "",
    nationality: employee.demographics.nationality ?? "",
    maritalStatus: employee.demographics.maritalStatus ?? "",
    emergencyContactName: employee.emergencyContact?.name ?? "",
    emergencyContactPhone: employee.emergencyContact?.phone ?? "",
    emergencyContactRelationship: employee.emergencyContact?.relationship ?? "",
    preferredName: employee.preferredName ?? "",
    personalEmail: employee.personalEmail ?? "",
    photoUrl: employee.photoUrl ?? "",
    acknowledgeHandbook: false,
    acknowledgePrivacy: false,
  }
}

interface ProfileOnboardingWizardProps {
  employee: Employee
}

export function ProfileOnboardingWizard({ employee }: ProfileOnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const defaultValues = useMemo(() => buildDefaultValues(employee), [employee])

  const form = useForm<ProfileOnboardingFormData>({
    resolver: zodResolver(profileOnboardingSchema),
    defaultValues,
    mode: "onBlur",
  })

  const goToStep = (index: number) => {
    if (index < 0 || index >= PROFILE_ONBOARDING_STEP_COUNT) return
    setSubmitError(null)
    setStep(index)
  }

  const goNext = async () => {
    setSubmitError(null)
    const schema = step === 0 ? contactStepSchema : policiesStepSchema
    const result = schema.safeParse(form.getValues())
    if (!result.success) {
      applyZodErrors(form, result.error)
      return
    }
    const next = Math.min(step + 1, PROFILE_ONBOARDING_STEP_COUNT - 1)
    setStep(next)
  }

  const onSubmit = form.handleSubmit(async data => {
    setSubmitError(null)
    try {
      await completeProfileOnboarding(data)
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      if (employee.id) {
        await queryClient.invalidateQueries({
          queryKey: employeeKeys.detail(employee.id),
        })
      }
      navigate({ to: "/dashboard" })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not save your profile")
    }
  })

  const currentStepDef = PROFILE_ONBOARDING_STEPS[step]
  const isLastStep = step === PROFILE_ONBOARDING_STEP_COUNT - 1

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6"
      >
        <HrAssignedSummary employee={employee} />

        <Card className="min-w-0 overflow-hidden border-border/80 shadow-sm">
          <div className="border-b border-border/60 bg-muted/25 px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {currentStepDef.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {currentStepDef.description}
                </p>
              </div>
              <ProfileOnboardingProgress currentStep={step} />
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {step === 0 && <ContactDetailsStep />}
            {step === 1 && <PoliciesStep />}
            {step === 2 && (
              <WelcomeReviewStep employee={employee} onEditStep={goToStep} />
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4",
              "sticky bottom-0 z-10 sm:static"
            )}
          >
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => goToStep(step - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Fields marked * are required. Optional sections can be updated later from
                your profile.
              </p>
            )}

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {submitError && (
                <p
                  className="text-center text-sm text-destructive sm:order-first sm:mr-4 sm:text-right"
                  role="alert"
                >
                  {submitError}
                </p>
              )}
              {!isLastStep ? (
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={goNext}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Complete setup
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
