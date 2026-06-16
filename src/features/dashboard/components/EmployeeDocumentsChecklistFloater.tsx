import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  X,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Employee } from "@/features/employees/types"
import {
  DOCUMENT_PHASE_LABELS,
  type ChecklistItem,
} from "@/features/employees/types/documents"
import { summarizeDocumentChecklist } from "../lib/documentChecklistSummary"

const COLLAPSED_STORAGE_KEY = "titohris-doc-checklist-collapsed"

interface EmployeeDocumentsChecklistFloaterProps {
  employee: Employee
  profileHref: string
}

function loadCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const isComplete = item.status === "complete"
  const isExpired = item.status === "expired"

  return (
    <li
      className={cn(
        "flex items-start justify-between gap-2 rounded-lg border px-3 py-2",
        isComplete
          ? "border-success/30 bg-success/5"
          : isExpired
            ? "border-destructive/40 bg-destructive/5"
            : "border-border/70 bg-card"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-foreground">{item.label}</p>
        {item.phase && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {DOCUMENT_PHASE_LABELS[item.phase]}
            {item.priority === "secondary" ? " · Optional" : ""}
          </p>
        )}
      </div>
      <Badge
        variant={isComplete ? "default" : isExpired ? "destructive" : "secondary"}
        className="shrink-0"
      >
        {isComplete ? "Done" : isExpired ? "Expired" : "Needed"}
      </Badge>
    </li>
  )
}

export function EmployeeDocumentsChecklistFloater({
  employee,
  profileHref,
}: EmployeeDocumentsChecklistFloaterProps) {
  const summary = useMemo(
    () => summarizeDocumentChecklist(employee.onboardingChecklist),
    [employee.onboardingChecklist]
  )
  const [expanded, setExpanded] = useState(() => !loadCollapsedPreference())

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(!expanded))
    } catch {
      /* ignore storage errors */
    }
  }, [expanded])

  if (summary.totalRequired === 0) return null

  const pendingCount = summary.pendingRequired.length
  const showFloater = !summary.allRequiredComplete || summary.secondary.some(i => i.status !== "complete")

  if (!showFloater && summary.allRequiredComplete) return null

  const visibleItems = summary.allRequiredComplete
    ? summary.secondary.filter(i => i.status !== "complete")
    : [...summary.pendingRequired, ...summary.secondary.filter(i => i.status !== "complete")]

  if (visibleItems.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-muted/50"
          aria-expanded={false}
          aria-label={`Documents checklist, ${pendingCount} required item${pendingCount === 1 ? "" : "s"} pending`}
        >
          <ClipboardList className="h-4 w-4 text-primary" aria-hidden />
          <span>Documents</span>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
              {pendingCount}
            </Badge>
          )}
          <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden />
        </button>
      ) : (
        <Card className="pointer-events-auto w-[min(100vw-2rem,22rem)] border-border/80 shadow-xl">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                Documents needed
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.completedRequiredCount} of {summary.totalRequired} required complete
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded(false)}
              aria-label="Minimize checklist"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 pb-3">
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={summary.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Required documents progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${summary.progressPercent}%` }}
              />
            </div>
            <ul className="max-h-[min(40vh,16rem)] space-y-2 overflow-y-auto pr-0.5">
              {visibleItems.map(item => (
                <ChecklistRow key={`${item.key}-${item.phase ?? "none"}`} item={item} />
              ))}
            </ul>
            {summary.allRequiredComplete && (
              <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/5 px-3 py-2 text-xs text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                All required documents are on file.
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2 border-t border-border/60 pt-3">
            <Button variant="outline" size="sm" className="w-full justify-between" asChild>
              <Link to={profileHref}>
                View in employment profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              Minimize
            </button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
