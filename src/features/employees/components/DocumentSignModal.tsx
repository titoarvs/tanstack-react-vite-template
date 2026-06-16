import { CheckCircle2, FileText, Loader2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { MockSignaturePad } from "./MockSignaturePad"

export interface DocumentSignModalSignedInfo {
  signedBy?: string
  signedAt?: string
  signatureDataUrl?: string
  extra?: React.ReactNode
}

interface DocumentSignModalProps {
  title: string
  description?: string
  documentContent: React.ReactNode
  signed?: boolean
  signedInfo?: DocumentSignModalSignedInfo
  className?: string
  /** Optional content above signature when signing (e.g. name field) */
  signFields?: React.ReactNode
  signatureDataUrl?: string | null
  onSignatureChange?: (dataUrl: string | null) => void
  onSubmit?: () => void | Promise<void>
  submitting?: boolean
  submitError?: string | null
  submitLabel?: string
  readOnlyFooter?: React.ReactNode
}

export function DocumentSignModal({
  title,
  description,
  documentContent,
  signed = false,
  signedInfo,
  className,
  signFields,
  signatureDataUrl,
  onSignatureChange,
  onSubmit,
  submitting = false,
  submitError,
  submitLabel = "Apply signature",
  readOnlyFooter,
}: DocumentSignModalProps) {
  const [open, setOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const [needsScroll, setNeedsScroll] = useState(false)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
    if (atBottom) setScrolledToEnd(true)
  }, [])

  const checkScrollUnlock = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const overflow = el.scrollHeight > el.clientHeight + 8
    setNeedsScroll(overflow)

    if (!overflow) {
      setScrolledToEnd(true)
      return
    }

    handleScroll()
  }, [handleScroll])

  useEffect(() => {
    if (!open) {
      setScrolledToEnd(false)
      setNeedsScroll(false)
      return
    }

    setScrolledToEnd(false)
    const el = scrollRef.current
    if (!el) return

    checkScrollUnlock()
    const t1 = window.setTimeout(checkScrollUnlock, 0)
    const t2 = window.setTimeout(checkScrollUnlock, 150)
    const observer = new ResizeObserver(checkScrollUnlock)
    observer.observe(el)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      observer.disconnect()
    }
  }, [open, documentContent, readOnlyFooter, checkScrollUnlock])

  const canSign = signed || scrolledToEnd

  return (
    <>
      <div
        className={cn(
          "flex w-full flex-col gap-3 rounded-lg border border-border/70 p-4",
          signed && "border-success/40 bg-success/5",
          className
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{title}</p>
              <Badge variant={signed ? "default" : "secondary"}>
                {signed ? "Signed" : "Signature required"}
              </Badge>
            </div>
            {signed && signedInfo?.signedAt && (
              <p className="mt-1 text-sm text-muted-foreground">
                {signedInfo.signedBy ? `${signedInfo.signedBy} · ` : ""}
                {new Date(signedInfo.signedAt).toLocaleString()}
              </p>
            )}
            {!signed && (
              <p className="mt-1 text-sm text-muted-foreground">
                Open to review and sign this document.
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant={signed ? "outline" : "default"}
          size="sm"
          className="w-full shrink-0 sm:w-auto sm:self-end"
          onClick={() => setOpen(true)}
        >
          {signed ? "View signed document" : "View & sign"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="grid h-[min(90dvh,780px)] max-h-[90dvh] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4 pr-12">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="min-h-0 overflow-y-auto px-6 py-4"
          >
            <div className="rounded-md border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground whitespace-pre-line">
              {documentContent}
            </div>

            {readOnlyFooter && (
              <div
                data-readonly-footer
                className="mt-4 rounded-md border border-border/50 bg-muted/15 p-3"
              >
                {readOnlyFooter}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border bg-card px-6 py-4">
            {signed ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Document signed</span>
                </div>
                {signedInfo?.signatureDataUrl && (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-muted/10 dark:bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Signature on file
                    </p>
                    <img
                      src={signedInfo.signatureDataUrl}
                      alt={`Signature for ${title}`}
                      className="max-h-20 w-full max-w-xs object-contain"
                    />
                  </div>
                )}
                {signedInfo?.extra}
                <DialogFooter className="mt-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div
                className={cn(
                  "space-y-4 transition-opacity",
                  !canSign && "pointer-events-none opacity-40"
                )}
              >
                {!canSign && needsScroll && (
                  <p className="text-center text-xs text-muted-foreground">
                    Scroll to the end of the document to unlock signing.
                  </p>
                )}
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sign below
                </p>
                {signFields}
                {onSignatureChange && (
                  <MockSignaturePad
                    label="Electronic signature"
                    hint="Draw your signature in the box below."
                    value={signatureDataUrl ?? undefined}
                    onChange={onSignatureChange}
                    disabled={!canSign}
                    active={open}
                    className="w-full"
                  />
                )}
                {submitError && (
                  <p className="text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
                <DialogFooter className="gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={!canSign || submitting}
                    onClick={async () => {
                      try {
                        await onSubmit?.()
                        setOpen(false)
                      } catch {
                        /* validation failed — keep modal open */
                      }
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing…
                      </>
                    ) : (
                      submitLabel
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
