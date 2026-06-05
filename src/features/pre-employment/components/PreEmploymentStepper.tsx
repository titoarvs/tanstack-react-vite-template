import { PRE_EMPLOYMENT_STEPS } from "../lib/preEmploymentSteps"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface PreEmploymentStepperProps {
  currentStep: number
  maxReachedStep: number
  onStepClick: (index: number) => void
}

export function PreEmploymentStepper({
  currentStep,
  maxReachedStep,
  onStepClick,
}: PreEmploymentStepperProps) {
  return (
    <nav aria-label="Pre-employment progress" className="w-full">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {PRE_EMPLOYMENT_STEPS.map((step, index) => {
          const isComplete = index < currentStep
          const isCurrent = index === currentStep
          const isReachable = index <= maxReachedStep
          const Icon = step.icon

          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col items-stretch sm:items-center">
              <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                <button
                  type="button"
                  disabled={!isReachable}
                  onClick={() => isReachable && onStepClick(index)}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete && "border-success bg-success text-success-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isComplete &&
                      !isCurrent &&
                      "border-border bg-card text-muted-foreground",
                    isReachable && !isCurrent && "hover:border-primary/50",
                    !isReachable && "cursor-not-allowed opacity-50"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </button>
                <div className="min-w-0 sm:text-center">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.shortLabel}
                  </p>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {step.label}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
