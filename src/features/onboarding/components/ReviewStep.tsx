import { Pencil } from "lucide-react"
import type { ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  getEmploymentTypeLabel,
  getFullStatusLabel,
  getStatusDetailLabel,
  getWorkLocationLabel,
  type EmploymentType,
} from "@/features/employees/types"
import { useManagersByDepartment } from "@/features/employees/hooks/useManagersByDepartment"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"
import type { OnboardingFormData } from "../schemas/onboardingSchema"
import { OnboardingStepShell } from "./OnboardingStepShell"
import { cn } from "@/lib/utils"

function formatGender(value?: string) {
  if (!value) return undefined
  return value
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/20">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
      <dl className="divide-y divide-border/60 px-4">{children}</dl>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  className,
}: {
  label: string
  value?: string
  className?: string
}) {
  if (!value) return null
  return (
    <div
      className={cn(
        "grid gap-1 py-3 sm:grid-cols-[minmax(0,8rem)_1fr] sm:gap-4",
        className
      )}
    >
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium text-foreground sm:text-right">
        {value}
      </dd>
    </div>
  )
}

interface ReviewStepProps {
  onEditStep: (index: number) => void
}

const step = ONBOARDING_STEPS[2]

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const { watch } = useFormContext<OnboardingFormData>()
  const data = watch()
  const managers = useManagersByDepartment(data.department)
  const manager = managers.find(m => m.id === data.managerId)
  const department = data.department
  const fullName = [data.firstName, data.middleName, data.lastName, data.suffix]
    .filter(Boolean)
    .join(" ")

  return (
    <OnboardingStepShell
      icon={step.icon}
      title={step.label}
      description={step.description}
    >
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
        Review all details below. Employment information will require HR
        approval to edit after submission.
      </div>

      <div className="rounded-xl border border-border/80 bg-accent/25 p-6">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-lg font-bold text-foreground">
            {fullName || "New employee"}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.jobTitle || data.position || "Position"} ·{" "}
            {department || "Department"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.employeeId}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReviewBlock title="Personal" onEdit={() => onEditStep(0)}>
          <ReviewRow label="Employee ID" value={data.employeeId} />
          <ReviewRow label="Name" value={fullName} />
          <ReviewRow label="Date of birth" value={data.dateOfBirth} />
          <ReviewRow label="Gender" value={formatGender(data.gender)} />
          <ReviewRow label="Nationality" value={data.nationality} />
          <ReviewRow label="Marital status" value={data.maritalStatus} />
          <ReviewRow label="Work email" value={data.email} />
        </ReviewBlock>

        <ReviewBlock title="Employment" onEdit={() => onEditStep(1)}>
          <ReviewRow label="Department" value={department} />
          <ReviewRow label="Position" value={data.position} />
          <ReviewRow label="Job title" value={data.jobTitle} />
          <ReviewRow label="Is manager" value={data.isManager ? "Yes" : "No"} />
          <ReviewRow
            label="Manager"
            value={
              manager ? `${manager.firstName} ${manager.lastName}` : undefined
            }
          />
          <ReviewRow label="Manager email" value={manager?.contact.email} />
          <ReviewRow
            label="Employment type"
            value={getEmploymentTypeLabel(
              data.employmentType as EmploymentType
            )}
          />
          <ReviewRow
            label="Status"
            value={getFullStatusLabel("active", data.statusDetail)}
          />
          <ReviewRow
            label="Active status"
            value={getStatusDetailLabel(data.statusDetail)}
          />
          <ReviewRow
            label="Work location"
            value={
              data.workLocation
                ? getWorkLocationLabel(data.workLocation)
                : undefined
            }
          />
          <ReviewRow label="Hire date" value={data.hireDate} />
          <ReviewRow label="Probation end" value={data.probationEndDate} />
          <ReviewRow label="Regularization" value={data.regularizationDate} />
          <ReviewRow label="Contract signed" value={data.contractSignedDate} />
        </ReviewBlock>
      </div>
    </OnboardingStepShell>
  )
}
