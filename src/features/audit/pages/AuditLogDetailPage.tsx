import { Link, useParams } from "@tanstack/react-router"
import { ChevronLeft, ScrollText } from "lucide-react"
import type { ReactNode } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/features/auth/components/RoleBadge"
import {
  AUDIT_CATEGORY_LABELS,
  formatAuditTimestamp,
  getActionLabel,
  getCategoryAccentClass,
  getCategoryIcon,
} from "../auditPresentation"
import { useAuditEntry } from "../hooks/useAuditEntry"
import { cn } from "@/lib/utils"

export function AuditLogDetailPage() {
  const { entryId } = useParams({ strict: false }) as { entryId?: string }
  const { entry } = useAuditEntry(entryId)

  if (!entryId) {
    return (
      <PageContent>
        <p className="text-destructive">Invalid audit event route.</p>
        <Link to="/audit-log" className="mt-4 inline-block text-sm text-primary">
          Back to audit log
        </Link>
      </PageContent>
    )
  }

  if (!entry) {
    return (
      <PageContent>
        <p className="text-muted-foreground">Audit event not found.</p>
        <Link to="/audit-log" className="mt-4 inline-block text-sm text-primary">
          Back to audit log
        </Link>
      </PageContent>
    )
  }

  const Icon = getCategoryIcon(entry.category)
  const occurred = new Date(entry.timestamp)

  return (
    <PageContent className="max-w-3xl">
      <Link
        to="/audit-log"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Audit log
      </Link>

      <Card
        className={cn(
          "overflow-hidden border-border/80 border-l-4 shadow-sm",
          getCategoryAccentClass(entry.category)
        )}
      >
        <CardHeader className="space-y-3 border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border/60">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-snug">{entry.summary}</CardTitle>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{entry.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{AUDIT_CATEGORY_LABELS[entry.category]}</Badge>
            <Badge variant="secondary">{getActionLabel(entry.action)}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <DetailSection title="When">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Occurred" value={formatAuditTimestamp(entry.timestamp)} />
              <DetailField
                label="ISO timestamp"
                value={entry.timestamp}
                mono
              />
              <DetailField
                label="Local date"
                value={occurred.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <DetailField
                label="Local time"
                value={occurred.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              />
            </dl>
          </DetailSection>

          <DetailSection title="Actor">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Name" value={entry.actorName} />
              <DetailField label="Email" value={entry.actorEmail} />
              <DetailField label="User ID" value={entry.actorId} mono />
              <div className="rounded-lg border border-border/60 bg-muted/15 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Role
                </dt>
                <dd className="mt-2">
                  <RoleBadge role={entry.actorRole} />
                </dd>
              </div>
            </dl>
          </DetailSection>

          <DetailSection title="Context">
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailField label="Organization ID" value={entry.organizationId} mono />
              <DetailField label="Pathname" value={entry.pathname ?? "—"} mono />
            </dl>
          </DetailSection>

          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <DetailSection title="Metadata">
              <dl className="grid gap-3 sm:grid-cols-2">
                {Object.entries(entry.metadata).map(([key, value]) => (
                  <DetailField key={key} label={key} value={value} />
                ))}
              </dl>
            </DetailSection>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <ScrollText className="h-3.5 w-3.5" />
        Mock audit record — stored in this browser only.
      </p>
    </PageContent>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

function DetailField({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/15 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1.5 break-all text-sm font-semibold text-foreground",
          mono && "font-mono text-xs font-medium"
        )}
      >
        {value}
      </dd>
    </div>
  )
}
