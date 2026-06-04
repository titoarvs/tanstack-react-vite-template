import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  PaginatedTableShell,
  TABLE_ROW_HEIGHT_PX,
} from "@/components/ui/paginated-data-table"
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { getRoleLabel } from "@/features/auth/roles"
import { usePagination } from "@/lib/pagination/usePagination"
import { AUDIT_CATEGORY_LABELS, formatAuditTimestamp } from "../auditPresentation"
import type { AuditLogEntry } from "../types"

const COLUMN_COUNT = 6

interface AuditLogTableProps {
  entries: AuditLogEntry[]
  /** Resets to page 1 when filters change */
  resetKey?: string
}

export function AuditLogTable({ entries, resetKey }: AuditLogTableProps) {
  const { pageItems, pagination } = usePagination(entries, {
    initialPageSize: 10,
    resetDeps: [resetKey],
  })

  return (
    <PaginatedTableShell
      pagination={pagination}
      columnCount={COLUMN_COUNT}
      filledRowCount={pageItems.length}
      minWidth="640px"
      header={
        <TableRow className="hover:bg-transparent">
          <TableHead>Time</TableHead>
          <TableHead>Summary</TableHead>
          <TableHead className="hidden sm:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell">Actor</TableHead>
          <TableHead className="hidden lg:table-cell">Path</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">View</span>
          </TableHead>
        </TableRow>
      }
    >
      {pageItems.length === 0 ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={COLUMN_COUNT} className="h-auto border-0 p-0">
            <div
              className="flex items-center justify-center text-sm text-muted-foreground"
              style={{ height: pagination.pageSize * TABLE_ROW_HEIGHT_PX }}
            >
              No audit events match your filters.
            </div>
          </TableCell>
        </TableRow>
      ) : (
        pageItems.map(entry => <AuditLogTableRow key={entry.id} entry={entry} />)
      )}
    </PaginatedTableShell>
  )
}

function AuditLogTableRow({ entry }: { entry: AuditLogEntry }) {
  return (
    <TableRow>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        <time dateTime={entry.timestamp}>{formatAuditTimestamp(entry.timestamp)}</time>
      </TableCell>
      <TableCell className="max-w-[16rem] sm:max-w-none">
        <Link
          to="/audit-log/$entryId"
          params={{ entryId: entry.id }}
          className="font-medium text-foreground hover:text-primary"
        >
          <span className="line-clamp-2 sm:line-clamp-1">{entry.summary}</span>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
          {AUDIT_CATEGORY_LABELS[entry.category]} · {getRoleLabel(entry.actorRole)}
        </p>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge variant="outline" className="text-[10px]">
          {AUDIT_CATEGORY_LABELS[entry.category]}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <p className="font-medium text-foreground">{entry.actorName}</p>
        <p className="text-xs text-muted-foreground">{getRoleLabel(entry.actorRole)}</p>
      </TableCell>
      <TableCell className="hidden max-w-[12rem] lg:table-cell">
        {entry.pathname ? (
          <span
            className="block truncate font-mono text-xs text-muted-foreground"
            title={entry.pathname}
          >
            {entry.pathname}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Link
          to="/audit-log/$entryId"
          params={{ entryId: entry.id }}
          className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          Details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </TableCell>
    </TableRow>
  )
}
