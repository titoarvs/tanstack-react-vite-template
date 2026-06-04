import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Loader2, Save, UserPlus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useCreateEmployee } from "@/features/employees/hooks/useEmployees"
import type { CreateEmployeeInput, Gender } from "@/features/employees/types"
import { cn } from "@/lib/utils"
import {
  deleteOnboardingDraft,
  fetchOnboardingDraft,
  regenerateDraftEmployeeId,
  saveOnboardingDraft,
} from "../api/onboardingDraftApi"
import { OnboardingWizardContext } from "../context/OnboardingWizardContext"
import { notifyOnboardingDraftsChanged } from "../hooks/useOnboardingDrafts"
import {
  employmentInfoSchema,
  onboardingDefaults,
  onboardingSchema,
  personalInfoSchema,
  type OnboardingFormData,
} from "../schemas/onboardingSchema"
import { ONBOARDING_STEP_COUNT, ONBOARDING_STEPS } from "../lib/onboardingSteps"
import { EmploymentInfoStep } from "./EmploymentInfoStep"
import { OnboardingStepper } from "./OnboardingStepper"
import { PersonalInfoStep } from "./PersonalInfoStep"
import { ReviewStep } from "./ReviewStep"

function toGender(value?: string): Gender | undefined {
  const allowed: Gender[] = ["male", "female", "other", "prefer-not-to-say"]
  return value && allowed.includes(value as Gender) ? (value as Gender) : undefined
}

function applyZodErrors(
  form: ReturnType<typeof useForm<OnboardingFormData>>,
  error: import("zod").ZodError
) {
  error.issues.forEach(issue => {
    const path = issue.path[0] as keyof OnboardingFormData
    if (path) form.setError(path, { message: issue.message })
  })
}

function buildFormDefaults(draftData: Partial<OnboardingFormData>): OnboardingFormData {
  return {
    ...onboardingDefaults,
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    hireDate: new Date().toISOString().slice(0, 10),
    ...draftData,
  } as OnboardingFormData
}

interface OnboardingWizardProps {
  draftId: string
  onExit: () => void
}

export function OnboardingWizard({ draftId, onExit }: OnboardingWizardProps) {
  const initialDraft = useMemo(() => fetchOnboardingDraft(draftId), [draftId])
  const [step, setStep] = useState(initialDraft?.currentStep ?? 0)
  const [maxReachedStep, setMaxReachedStep] = useState(initialDraft?.maxReachedStep ?? 0)
  const [isRegeneratingId, setIsRegeneratingId] = useState(false)
  const createEmployee = useCreateEmployee()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: buildFormDefaults(initialDraft?.data ?? {}),
    mode: "onBlur",
  })

  const [firstName, lastName, employeeId] = useWatch({
    control: form.control,
    name: ["firstName", "lastName", "employeeId"],
  })

  const persistDraftQuiet = useCallback(
    (overrides?: { currentStep?: number; maxReachedStep?: number }) => {
      const currentStep = overrides?.currentStep ?? step
      const nextMaxReached = overrides?.maxReachedStep ?? maxReachedStep
      saveOnboardingDraft({
        draftId,
        currentStep,
        maxReachedStep: nextMaxReached,
        data: form.getValues(),
      })
    },
    [draftId, form, maxReachedStep, step]
  )

  const persistDraftAndNotify = useCallback(() => {
    saveOnboardingDraft({
      draftId,
      currentStep: step,
      maxReachedStep,
      data: form.getValues(),
    })
    notifyOnboardingDraftsChanged()
  }, [draftId, form, maxReachedStep, step])

  const regenerateEmployeeId = useCallback(() => {
    setIsRegeneratingId(true)
    try {
      const updated = regenerateDraftEmployeeId(draftId)
      form.setValue("employeeId", updated.data.employeeId ?? "", { shouldDirty: true })
      saveOnboardingDraft({
        draftId,
        currentStep: step,
        maxReachedStep,
        data: form.getValues(),
      })
    } finally {
      setIsRegeneratingId(false)
    }
  }, [draftId, form, maxReachedStep, step])

  if (!initialDraft) {
    return (
      <Card className="border-border/80 p-8 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">This onboarding draft was removed or expired.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={onExit}>
          Back to onboarding home
        </Button>
      </Card>
    )
  }

  const goToStep = (index: number) => {
    if (index < 0 || index >= ONBOARDING_STEP_COUNT) return
    setSubmitError(null)
    setStep(index)
    persistDraftQuiet({ currentStep: index })
  }

  const goNext = async () => {
    setSubmitError(null)
    const schema = step === 0 ? personalInfoSchema : employmentInfoSchema
    const result = schema.safeParse(form.getValues())
    if (!result.success) {
      applyZodErrors(form, result.error)
      return
    }
    const next = Math.min(step + 1, ONBOARDING_STEP_COUNT - 1)
    const nextMax = Math.max(maxReachedStep, next)
    setMaxReachedStep(nextMax)
    setStep(next)
    persistDraftQuiet({ currentStep: next, maxReachedStep: nextMax })
  }

  const handleSaveAndExit = () => {
    persistDraftAndNotify()
    onExit()
  }

  const onSubmit = form.handleSubmit(async data => {
    setSubmitError(null)
    const department =
      data.department === "Other" ? (data.departmentOther ?? "").trim() : data.department

    const input: CreateEmployeeInput = {
      employeeId: data.employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      demographics: {
        dateOfBirth: data.dateOfBirth || undefined,
        gender: toGender(data.gender),
        nationality: data.nationality || undefined,
        maritalStatus: data.maritalStatus || undefined,
      },
      contact: {
        email: data.email,
        phone: data.phone,
        address: data.address || undefined,
      },
      photoUrl: data.photoUrl,
      department,
      position: data.position,
      managerId: data.managerId || undefined,
      employmentType: data.employmentType,
      lifecycle: {
        hireDate: data.hireDate,
        probationEndDate: data.probationEndDate || undefined,
        contractStartDate: data.contractStartDate || undefined,
        contractEndDate: data.contractEndDate || undefined,
      },
      status: "active",
      officeBranch: data.officeBranch,
    }

    try {
      await createEmployee.mutateAsync(input)
      deleteOnboardingDraft(draftId)
      notifyOnboardingDraftsChanged()
      onExit()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to create employee")
    }
  })

  const currentStepDef = ONBOARDING_STEPS[step]
  const isLastStep = step === ONBOARDING_STEP_COUNT - 1
  const displayName =
    `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
    initialDraft.data.employeeId ||
    "New hire"

  return (
    <OnboardingWizardContext.Provider value={{ regenerateEmployeeId, isRegeneratingId }}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-5 sm:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-4 py-3 text-sm shadow-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">
                Draft · <span className="font-mono">{employeeId}</span>
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={handleSaveAndExit}>
              <Save className="h-4 w-4" />
              Save & exit
            </Button>
          </div>

          <OnboardingStepper
            currentStep={step}
            maxReachedStep={maxReachedStep}
            onStepClick={goToStep}
          />

          <Card className="min-w-0 overflow-hidden border-border/80 shadow-sm">
            <div className="border-b border-border/60 bg-muted/25 px-4 py-3 sm:px-6">
              <p className="text-sm font-medium text-foreground">{currentStepDef.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {currentStepDef.description}
              </p>
            </div>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              {step === 0 && <PersonalInfoStep />}
              {step === 1 && <EmploymentInfoStep />}
              {step === 2 && <ReviewStep onEditStep={goToStep} />}
            </CardContent>

            <CardFooter
              className={cn(
                "flex flex-col gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4",
                "sticky bottom-0 z-10 sm:static"
              )}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => (step === 0 ? handleSaveAndExit() : goToStep(step - 1))}
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? "Save & exit" : "Back"}
              </Button>

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
                  <Button type="button" className="w-full sm:w-auto" onClick={goNext}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={createEmployee.isPending}
                  >
                    {createEmployee.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create employee
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </OnboardingWizardContext.Provider>
  )
}
