import { PROFILE_ONBOARDING_STEPS } from "../lib/profileOnboardingSteps"

interface ProfileOnboardingProgressProps {
  currentStep: number
}

export function ProfileOnboardingProgress({ currentStep }: ProfileOnboardingProgressProps) {
  const progress = ((currentStep + 1) / PROFILE_ONBOARDING_STEPS.length) * 100

  return (
    <div
      className="w-full max-w-[9rem] shrink-0 sm:max-w-[10.5rem]"
      aria-label={`Step ${currentStep + 1} of ${PROFILE_ONBOARDING_STEPS.length}, ${Math.round(progress)}% complete`}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-medium">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {PROFILE_ONBOARDING_STEPS.length}
        </span>
        <span className="text-foreground">{Math.round(progress)}%</span>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
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
    </div>
  )
}
