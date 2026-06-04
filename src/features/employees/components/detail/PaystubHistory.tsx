import {
  PaginatedTableShell,
  TABLE_ROW_HEIGHT_PX,
} from "@/components/ui/paginated-data-table"
import { TablePagination } from "@/components/ui/table-pagination"
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { usePagination, type PaginationState } from "@/lib/pagination/usePagination"
import type { PaystubHistoryRow } from "../../data/mockEmployeeInsights"
import { formatCurrency } from "../../lib/formatCurrency"

const COLUMN_COUNT = 6
const PAGE_SIZE_OPTIONS = [6, 12, 24] as const

interface PaystubHistoryProps {
  rows: PaystubHistoryRow[]
}

export function PaystubHistory({ rows }: PaystubHistoryProps) {
  const { pageItems, pagination } = usePagination(rows, {
    initialPageSize: 6,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  })

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      <ul
        className="divide-y divide-border md:hidden"
        style={{ minHeight: pagination.pageSize * 88 }}
      >
        {pageItems.length === 0 ? (
          <li className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            No pay history yet.
          </li>
        ) : (
          pageItems.map(row => (
            <li key={row.payDateIso} className="p-4">
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:underline"
              >
                {row.payDate}
              </button>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Gross</dt>
                  <dd className="pay-amount-cell font-semibold">{formatCurrency(row.gross)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Net</dt>
                  <dd className="pay-amount-cell font-semibold">{formatCurrency(row.net)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Taxes</dt>
                  <dd className="pay-amount-cell">{formatCurrency(row.taxes)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Deductions</dt>
                  <dd className="pay-amount-cell">{formatCurrency(row.deductions)}</dd>
                </div>
                <div className="col-span-2 border-t border-border pt-2">
                  <dt className="text-muted-foreground">YTD net</dt>
                  <dd className="pay-amount-cell font-semibold">{formatCurrency(row.ytdNet)}</dd>
                </div>
              </dl>
            </li>
          ))
        )}
      </ul>

      <div className="hidden md:block">
        <PaginatedTableShell
          pagination={pagination}
          columnCount={COLUMN_COUNT}
          filledRowCount={pageItems.length}
          minWidth="640px"
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          className="rounded-none border-0 shadow-none"
          header={
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium normal-case text-muted-foreground">
                Pay date
              </TableHead>
              <TableHead className="font-medium normal-case text-muted-foreground">
                Total gross pay
              </TableHead>
              <TableHead className="font-medium normal-case text-muted-foreground">
                Taxes
              </TableHead>
              <TableHead className="font-medium normal-case text-muted-foreground">
                Deductions
              </TableHead>
              <TableHead className="font-medium normal-case text-muted-foreground">
                Net amount
              </TableHead>
              <TableHead className="font-medium normal-case text-muted-foreground">
                YTD net
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
                  No pay history yet.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map(row => (
            <TableRow key={row.payDateIso}>
              <TableCell>
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                >
                  {row.payDate}
                </button>
              </TableCell>
              <TableCell className="pay-amount-cell">{formatCurrency(row.gross)}</TableCell>
              <TableCell className="pay-amount-cell">{formatCurrency(row.taxes)}</TableCell>
              <TableCell className="pay-amount-cell">{formatCurrency(row.deductions)}</TableCell>
              <TableCell className="pay-amount-cell">{formatCurrency(row.net)}</TableCell>
              <TableCell className="pay-amount-cell">{formatCurrency(row.ytdNet)}</TableCell>
            </TableRow>
            ))
          )}
        </PaginatedTableShell>
      </div>

      <div className="md:hidden">
        <PaystubMobilePagination pagination={pagination} />
      </div>
    </div>
  )
}

function PaystubMobilePagination({ pagination }: { pagination: PaginationState }) {
  return (
    <TablePagination
      pagination={pagination}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      className="border-t"
    />
  )
}
