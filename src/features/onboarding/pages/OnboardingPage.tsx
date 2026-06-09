import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { PageContent } from "@/components/layout/PageContent"
import { OnboardingWizard } from "../components/OnboardingWizard"

export function OnboardingPage() {
  return (
    <PageContent className="bg-container">
      <div className="relative mx-auto max-w-6xl">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--success) 12%, transparent) 0%, transparent 40%), radial-gradient(circle at 0% 100%, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 35%)",
          }}
        />

        <Link
          to="/employees/directory"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to directory
        </Link>

        <OnboardingWizard />
      </div>
    </PageContent>
  )
}
