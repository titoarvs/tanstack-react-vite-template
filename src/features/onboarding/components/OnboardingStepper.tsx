import { Check } from "lucide-react"
import { Fragment } from "react"
import { cn } from "@/lib/utils"
import { ONBOARDING_STEPS } from "../lib/onboardingSteps"

interface OnboardingStepperProps {
  currentStep: number
  maxReachedStep: number
  onStepClick?: (index: number) => void
}

export function OnboardingStepper({
  currentStep,
  maxReachedStep,
  onStepClick,
}: OnboardingStepperProps) {
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <nav
      aria-label="Onboarding progress"
      className="w-full rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs font-medium">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-foreground">{Math.round(progress)}% complete</span>
      </div>

      <div
        className="mb-5 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-success transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="flex w-full list-none items-start p-0">
        {ONBOARDING_STEPS.map((step, index) => {
          const Icon = step.icon
          const isComplete = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep
          const isClickable =
            index <= maxReachedStep && Boolean(onStepClick) && index !== currentStep
          const segmentComplete = index > 0 && index <= currentStep

          return (
            <Fragment key={step.id}>
              {index > 0 && (
                <li
                  className="flex min-w-[0.5rem] flex-1 items-center pb-8 sm:min-w-[1rem] sm:pb-9"
                  aria-hidden
                >
                  <div
                    className={cn(
                      "onboarding-step-connector h-0.5 w-full",
                      segmentComplete && "onboarding-step-connector-complete"
                    )}
                  />
                </li>
              )}

              <li className="flex shrink-0 flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(index)}
                  className={cn(
                    "group flex max-w-[6.5rem] flex-col items-center gap-1.5 rounded-lg px-2 py-1 transition-colors sm:max-w-[7.5rem] sm:gap-2",
                    isCurrent && "onboarding-step-item-active",
                    isClickable && "cursor-pointer hover:bg-muted/50",
                    !isClickable && "cursor-default"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-9 sm:w-9",
                      isComplete && "border-success bg-success text-primary-foreground",
                      isCurrent &&
                        !isComplete &&
                        "border-success bg-accent text-accent-foreground ring-2 ring-success/20",
                      isUpcoming && "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <Icon className="h-4 w-4" aria-hidden />
                    )}
                  </span>

                  <span className="w-full text-center">
                    <span
                      className={cn(
                        "block text-[11px] font-semibold leading-tight sm:text-xs",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.shortLabel}
                    </span>
                    <span className="mt-0.5 hidden text-[10px] leading-snug text-muted-foreground lg:block">
                      {step.description}
                    </span>
                  </span>
                </button>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
