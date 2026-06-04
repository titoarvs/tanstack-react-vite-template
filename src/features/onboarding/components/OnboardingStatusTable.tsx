import { Link } from "@tanstack/react-router"
import { ArrowRight, MoreHorizontal, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaginatedTableShell } from "@/components/ui/paginated-data-table"
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { useEmployees } from "@/features/employees/hooks/useEmployees"
import { usePagination } from "@/lib/pagination/usePagination"
import { formatDraftUpdatedAt } from "../lib/onboardingDraftPresentation"
import {
  buildOnboardingTableRows,
  filterOnboardingRows,
  getEmployeeWelcomeStatus,
  getHrSetupStatus,
  getRowDisplayName,
  getRowUpdatedAt,
  HR_SETUP_LABELS,
  type OnboardingTableFilter,
  type OnboardingTableRow,
  WELCOME_STATUS_LABELS,
} from "../lib/onboardingStatus"
import { useOnboardingDrafts } from "../hooks/useOnboardingDrafts"

const COLUMN_COUNT = 7

const FILTER_OPTIONS: { value: OnboardingTableFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs_attention", label: "Needs attention" },
  { value: "complete", label: "Complete" },
]

interface OnboardingStatusTableProps {
  onResumeDraft: (draftId: string) => void
}

function StatusBadge({
  label,
  variant,
}: {
  label: string
  variant: "default" | "secondary" | "outline" | "destructive"
}) {
  return (
    <Badge variant={variant} className="text-[10px] font-medium">
      {label}
    </Badge>
  )
}

function hrBadgeVariant(status: ReturnType<typeof getHrSetupStatus>) {
  if (status === "complete") return "secondary" as const
  return "outline" as const
}

function welcomeBadgeVariant(status: ReturnType<typeof getEmployeeWelcomeStatus>) {
  if (status === "complete") return "secondary" as const
  if (status === "pending") return "outline" as const
  return "secondary" as const
}

function OnboardingStatusRow({
  row,
  onResumeDraft,
  onDeleteDraft,
}: {
  row: OnboardingTableRow
  onResumeDraft: (draftId: string) => void
  onDeleteDraft: (draftId: string) => void
}) {
  const hrStatus = getHrSetupStatus(row)
  const welcomeStatus = getEmployeeWelcomeStatus(row)
  const name = getRowDisplayName(row)
  const updatedAt = getRowUpdatedAt(row)

  if (row.kind === "draft") {
    const { draft } = row
    return (
      <TableRow>
        <TableCell>
          <div className="flex min-w-[12rem] items-center gap-3">
            <EmployeeAvatar
              src={draft.data.photoUrl}
              name={name}
              className="h-9 w-9 shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">HR draft</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="font-mono text-[10px]">
            {draft.data.employeeId ?? "—"}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <span className="text-sm text-muted-foreground">
            {draft.data.position?.trim() || "—"}
            {draft.data.department ? ` · ${draft.data.department}` : ""}
          </span>
        </TableCell>
        <TableCell>
          <StatusBadge label={HR_SETUP_LABELS[hrStatus]} variant={hrBadgeVariant(hrStatus)} />
        </TableCell>
        <TableCell>
          <StatusBadge
            label={WELCOME_STATUS_LABELS[welcomeStatus]}
            variant={welcomeBadgeVariant(welcomeStatus)}
          />
        </TableCell>
        <TableCell className="hidden sm:table-cell whitespace-nowrap text-muted-foreground">
          {formatDraftUpdatedAt(updatedAt)}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button type="button" size="sm" onClick={() => onResumeDraft(draft.id)}>
              Resume
              <ArrowRight className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDeleteDraft(draft.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Discard draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const { employee } = row
  return (
    <TableRow>
      <TableCell>
        <Link
          to="/employees/$employeeId"
          params={{ employeeId: employee.id }}
          className="flex min-w-[12rem] items-center gap-3"
        >
          <EmployeeAvatar
            src={employee.photoUrl}
            name={name}
            className="h-9 w-9 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{employee.employeeId}</p>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs">{employee.employeeId}</span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <p className="max-w-[10rem] truncate text-sm">{employee.position}</p>
        <p className="max-w-[10rem] truncate text-xs text-muted-foreground">
          {employee.department}
        </p>
      </TableCell>
      <TableCell>
        <StatusBadge label={HR_SETUP_LABELS[hrStatus]} variant={hrBadgeVariant(hrStatus)} />
      </TableCell>
      <TableCell>
        <StatusBadge
          label={WELCOME_STATUS_LABELS[welcomeStatus]}
          variant={welcomeBadgeVariant(welcomeStatus)}
        />
      </TableCell>
      <TableCell className="hidden sm:table-cell whitespace-nowrap text-sm text-muted-foreground">
        {formatDraftUpdatedAt(updatedAt)}
      </TableCell>
      <TableCell className="text-right">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link to="/employees/$employeeId" params={{ employeeId: employee.id }}>
            View
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function OnboardingStatusTable({ onResumeDraft }: OnboardingStatusTableProps) {
  const [filter, setFilter] = useState<OnboardingTableFilter>("all")
  const { drafts, removeDraft } = useOnboardingDrafts()
  const { data: employees = [], isLoading } = useEmployees()

  const allRows = useMemo(
    () => buildOnboardingTableRows(drafts, employees),
    [drafts, employees]
  )

  const filteredRows = useMemo(
    () => filterOnboardingRows(allRows, filter),
    [allRows, filter]
  )

  const { pageItems, pagination } = usePagination(filteredRows, {
    initialPageSize: 10,
    resetDeps: [filter, drafts.length, employees.length],
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            type="button"
            size="sm"
            variant={filter === opt.value ? "default" : "outline"}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <PaginatedTableShell
        pagination={pagination}
        columnCount={COLUMN_COUNT}
        filledRowCount={pageItems.length}
        minWidth="900px"
        header={
          <TableRow className="hover:bg-transparent">
            <TableHead>Employee</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="hidden md:table-cell">Role</TableHead>
            <TableHead>HR setup</TableHead>
            <TableHead>Employee welcome</TableHead>
            <TableHead className="hidden sm:table-cell">Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        }
      >
        {isLoading ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMN_COUNT} className="h-auto border-0 p-0">
              <div
                className="flex items-center justify-center text-sm text-muted-foreground"
                style={{ height: pagination.pageSize * 52 }}
              >
                Loading…
              </div>
            </TableCell>
          </TableRow>
        ) : pageItems.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMN_COUNT} className="h-auto border-0 p-0">
              <div
                className="flex items-center justify-center text-sm text-muted-foreground"
                style={{ height: pagination.pageSize * 52 }}
              >
                No rows match this filter.
              </div>
            </TableCell>
          </TableRow>
        ) : (
          pageItems.map(row => (
            <OnboardingStatusRow
              key={row.id}
              row={row}
              onResumeDraft={onResumeDraft}
              onDeleteDraft={removeDraft}
            />
          ))
        )}
      </PaginatedTableShell>
    </div>
  )
}
