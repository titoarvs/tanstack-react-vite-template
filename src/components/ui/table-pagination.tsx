import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { PaginationState } from "@/lib/pagination/usePagination"

interface TablePaginationProps {
  pagination: PaginationState
  pageSizeOptions?: readonly number[]
  className?: string
}

export function TablePagination({
  pagination,
  pageSizeOptions = [10, 25, 50],
  className,
}: TablePaginationProps) {
  const {
    page,
    pageSize,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    canPrevious,
    canNext,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
  } = pagination

  if (totalItems === 0) return null

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {rangeStart}–{rangeEnd}
        </span>{" "}
        of <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={v => setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[4.5rem] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="hidden text-xs text-muted-foreground sm:inline">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canPrevious}
            onClick={previousPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canNext}
            onClick={nextPage}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {totalPages > 1 && totalPages <= 7 && (
          <div className="flex gap-0.5 sm:hidden">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <Button
                key={pageNum}
                type="button"
                variant={pageNum === page ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
