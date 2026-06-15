import { Link, useNavigate } from "@tanstack/react-router"
import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/features/auth/useAuth"
import { resolvePostLoginNavigation } from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { PrivacyNoticeContent } from "../components/PrivacyNoticeContent"
import { recordPrivacyConsent } from "../api/privacyConsentApi"
import {
  PRIVACY_NOTICE_EFFECTIVE_DATE,
  PRIVACY_NOTICE_VERSION,
} from "../privacyNotice"

export function PrivacyConsentPage() {
  const { user, requestLogout } = useAuth()
  const navigate = useNavigate()
  const [acknowledged, setAcknowledged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!acknowledged || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await recordPrivacyConsent()
      const target = resolvePostLoginNavigation(user)
      navigate(target)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save consent. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b border-dashed border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/">
            <TitoLogo size="md" />
          </Link>
          <button
            type="button"
            onClick={() => {
              requestLogout(() => navigate({ to: "/login" }))
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Card className="p-6 shadow-none sm:p-8">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-foreground" aria-hidden />
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              Data privacy consent
            </h1>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Please review and acknowledge the Privacy Notice before continuing to your ESS profile.
          </p>

          <div className="mt-6 rounded-lg border border-dashed border-border">
            <ScrollArea className="h-[min(50vh,20rem)]">
              <div className="p-4">
                <PrivacyNoticeContent />
              </div>
            </ScrollArea>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Privacy notice version {PRIVACY_NOTICE_VERSION} · effective {PRIVACY_NOTICE_EFFECTIVE_DATE}
          </p>

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-input"
            />
            <span className="text-sm leading-snug text-foreground">
              I acknowledge that I have read and understood this Privacy Notice and consent to the
              processing of my personal data as described.
            </span>
          </label>

          {error ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            variant={acknowledged && !submitting ? "default" : "outline"}
            className="mt-6 h-11 w-full"
            disabled={!acknowledged || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Continue to ESS portal"
            )}
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Your acknowledgment is recorded with a timestamp, IP address and notice version for
            compliance.
          </p>
        </Card>
      </main>
    </div>
  )
}
