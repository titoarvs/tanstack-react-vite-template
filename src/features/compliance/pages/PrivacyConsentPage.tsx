import { Link, useNavigate } from "@tanstack/react-router"
import { Loader2, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/useAuth"
import { resolvePostLoginNavigation } from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { PrivacyNoticeContent } from "../components/PrivacyNoticeContent"
import { recordPrivacyConsent } from "../api/privacyConsentApi"
import { RequiredMark } from "@/components/ui/required-mark"

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
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 10%, color-mix(in oklch, var(--tito-green) 14%, transparent) 0%, transparent 45%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 40%)",
        }}
      />

      <header className="relative border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
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

      <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Data Privacy Notice
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Before you access the employee portal or provide personal information, please read
              and acknowledge this notice.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Privacy Notice</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[min(50vh,28rem)] overflow-y-auto pt-6">
            <PrivacyNoticeContent />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 border-t border-border pt-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={e => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <span className="text-sm leading-snug text-foreground">
                I acknowledge that I have read and understood the Privacy Notice{" "}
                <RequiredMark />
              </span>
            </label>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="button"
              className="w-full sm:w-auto sm:self-end"
              disabled={!acknowledged || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
