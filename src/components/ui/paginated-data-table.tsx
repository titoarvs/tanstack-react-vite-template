import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { PaginationState } from "@/lib/pagination/usePagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TablePagination } from "@/components/ui/table-pagination"

/** Uniform row height (px) — keep in sync with TableCell h-[3.25rem] */
export const TABLE_ROW_HEIGHT_PX = 52

/** Shell for custom row markup while keeping uniform height + pagination */
interface PaginatedTableShellProps {
  pagination: PaginationState
  columnCount: number
  filledRowCount: number
  minWidth?: string
  pageSizeOptions?: readonly number[]
  className?: string
  header: ReactNode
  children: ReactNode
}

export function PaginatedTableShell({
  pagination,
  columnCount,
  filledRowCount,
  minWidth = "640px",
  pageSizeOptions,
  className,
  header,
  children,
}: PaginatedTableShellProps) {
  const bodyHeight = pagination.pageSize * TABLE_ROW_HEIGHT_PX
  const spacerCount = Math.max(0, pagination.pageSize - filledRowCount)

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm",
        className
      )}
    >
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ minHeight: bodyHeight, maxHeight: bodyHeight }}
      >
        <Table style={{ minWidth }}>
          <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
            {header}
          </TableHeader>
          <TableBody>
            {children}
            {filledRowCount > 0 &&
              Array.from({ length: spacerCount }).map((_, i) => (
                <TableRow
                  key={`spacer-${i}`}
                  className="pointer-events-none border-0 hover:bg-transparent"
                  aria-hidden
                >
                  <TableCell colSpan={columnCount} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination pagination={pagination} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}
