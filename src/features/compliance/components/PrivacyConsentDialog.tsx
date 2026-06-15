import { FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PrivacyNoticeContent } from "./PrivacyNoticeContent"
import { recordPrivacyConsent } from "../api/privacyConsentApi"
import {
  PRIVACY_NOTICE_EFFECTIVE_DATE,
  PRIVACY_NOTICE_VERSION,
} from "../privacyNotice"

interface PrivacyConsentDialogProps {
  open: boolean
  onComplete: () => void
}

export function PrivacyConsentDialog({ open, onComplete }: PrivacyConsentDialogProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!acknowledged || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await recordPrivacyConsent()
      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save consent. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(92dvh,720px)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-6 sm:p-8"
        onEscapeKeyDown={event => event.preventDefault()}
        onPointerDownOutside={event => event.preventDefault()}
        onInteractOutside={event => event.preventDefault()}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-foreground" aria-hidden />
          <DialogTitle className="text-base font-semibold tracking-tight">
            Data privacy consent
          </DialogTitle>
        </div>

        <DialogDescription className="text-sm">
          Please review and acknowledge the Privacy Notice before continuing to your ESS profile.
        </DialogDescription>

        <div className="rounded-lg border border-dashed border-border">
          <ScrollArea className="h-[min(40vh,16rem)]">
            <div className="p-4">
              <PrivacyNoticeContent />
            </div>
          </ScrollArea>
        </div>

        <p className="text-xs text-muted-foreground">
          Privacy notice version {PRIVACY_NOTICE_VERSION} · effective {PRIVACY_NOTICE_EFFECTIVE_DATE}
        </p>

        <label className="flex cursor-pointer items-start gap-3">
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
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          variant={acknowledged && !submitting ? "default" : "outline"}
          className="h-11 w-full"
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

        <p className="text-center text-xs text-muted-foreground">
          Your acknowledgment is recorded with a timestamp, IP address and notice version for
          compliance.
        </p>
      </DialogContent>
    </Dialog>
  )
}
