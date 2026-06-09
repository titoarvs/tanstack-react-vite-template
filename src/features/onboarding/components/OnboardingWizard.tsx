import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { suggestEmployeeId } from "@/features/employees/api/employeeApi"
import { useCreateEmployee } from "@/features/employees/hooks/useEmployees"
import { provisionPortalUser } from "@/features/auth/provisionedUserStorage"
import {
  resolveOrganizationId,
  resolveOrganizationName,
} from "@/features/billing/organization"
import { useAuth } from "@/features/auth/useAuth"
import { toGender } from "@/features/employees/lib/employeeCalculations"
import {
  computeProbationEnd,
  computeRegularizationDate,
} from "@/features/employees/lib/employeeCalculations"
import { resolveStatusForCreate } from "@/features/employees/lib/employmentStatus"
import type {
  CreateEmployeeInput,
  EmploymentType,
} from "@/features/employees/types"
import type { ActiveStatusDetail, WorkLocation } from "@/features/employees/data/masterData"
import { cn } from "@/lib/utils"
import {
  employmentInfoSchema,
  onboardingDefaults,
  onboardingSchema,
  personalInfoSchema,
  type OnboardingFormData,
} from "../schemas/onboardingSchema"
import { ONBOARDING_STEP_COUNT, ONBOARDING_STEPS } from "../lib/onboardingSteps"
import { EmploymentInfoStep } from "./EmploymentInfoStep"
import { OnboardingConfirmDialog } from "./OnboardingConfirmDialog"
import { OnboardingProgress } from "./OnboardingStepper"
import { PersonalInfoStep } from "./PersonalInfoStep"
import { ReviewStep } from "./ReviewStep"

function applyZodErrors(
  form: ReturnType<typeof useForm<OnboardingFormData>>,
  error: import("zod").ZodError
) {
  error.issues.forEach(issue => {
    const path = issue.path[0] as keyof OnboardingFormData
    if (path) form.setError(path, { message: issue.message })
  })
}

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const createEmployee = useCreateEmployee()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      ...onboardingDefaults,
      employeeId: suggestEmployeeId(),
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      jobTitle: "",
      hireDate: today,
      contractSignedDate: today,
    },
    mode: "onBlur",
  })

  const goToStep = (index: number) => {
    if (index < 0 || index >= ONBOARDING_STEP_COUNT) return
    setSubmitError(null)
    setStep(index)
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
    if (next === ONBOARDING_STEP_COUNT - 1) {
      form.setValue("employeeId", suggestEmployeeId())
    }
    setStep(next)
  }

  const onSubmit = form.handleSubmit(async data => {
    setSubmitError(null)

    const employeeId = suggestEmployeeId()
    form.setValue("employeeId", employeeId)

    const probationEndDate =
      data.probationEndDate ?? computeProbationEnd(data.hireDate) ?? undefined
    const regularizationDate =
      data.regularizationDate ??
      computeRegularizationDate(data.hireDate, probationEndDate) ??
      undefined
    const { status, statusDetail } = resolveStatusForCreate(
      data.statusDetail as ActiveStatusDetail
    )

    const input: CreateEmployeeInput = {
      employeeId,
      firstName: data.firstName,
      middleName: data.middleName || undefined,
      lastName: data.lastName,
      suffix: data.suffix || undefined,
      demographics: {
        dateOfBirth: data.dateOfBirth || undefined,
        gender: toGender(data.gender),
        nationality: data.nationality || undefined,
        maritalStatus: data.maritalStatus || undefined,
      },
      contact: {
        email: data.email,
        phone: "",
      },
      department: data.department,
      position: data.position,
      jobTitle: data.jobTitle,
      isManager: data.isManager,
      managerId: data.isManager ? undefined : data.managerId || undefined,
      workLocation: data.workLocation as WorkLocation,
      employmentType: data.employmentType as EmploymentType,
      lifecycle: {
        hireDate: data.hireDate,
        probationEndDate,
        regularizationDate,
      },
      status,
      statusDetail,
      contractSignedDate: data.contractSignedDate,
      regularizationDate,
      profileOnboardingComplete: false,
    }

    try {
      const created = await createEmployee.mutateAsync(input)
      if (user) {
        provisionPortalUser({
          email: data.email,
          employeeId: created.id,
          name: `${data.firstName} ${data.lastName}`.trim(),
          organizationId: resolveOrganizationId(user),
          organizationName: resolveOrganizationName(user),
        })
      }
      setConfirmOpen(false)
      navigate({ to: "/employees/directory" })
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "Failed to create employee"
      )
    }
  })

  const currentStepDef = ONBOARDING_STEPS[step]
  const isLastStep = step === ONBOARDING_STEP_COUNT - 1

  return (
    <Form {...form}>
      <form
        onSubmit={e => e.preventDefault()}
        className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6"
      >
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
              <OnboardingProgress currentStep={step} />
            </div>
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
              onClick={() =>
                step === 0
                  ? navigate({ to: "/employees/directory" })
                  : goToStep(step - 1)
              }
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 0 ? "Cancel" : "Back"}
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
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={createEmployee.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Create employee
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <OnboardingConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={onSubmit}
          isSubmitting={createEmployee.isPending}
        />
      </form>
    </Form>
  )
}
