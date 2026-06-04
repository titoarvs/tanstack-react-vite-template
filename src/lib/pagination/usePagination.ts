import { useEffect, useMemo, useState } from "react"

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50] as const

export interface UsePaginationOptions {
  initialPageSize?: number
  pageSizeOptions?: readonly number[]
  /** When any value changes, current page resets to 1 */
  resetDeps?: readonly unknown[]
}

export interface PaginationState {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  rangeStart: number
  rangeEnd: number
  canPrevious: boolean
  canNext: boolean
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
}

export function usePagination<T>(
  items: T[],
  options?: UsePaginationOptions
): { pageItems: T[]; pagination: PaginationState } {
  const pageSizeOptions = options?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS
  const initialSize = options?.initialPageSize ?? pageSizeOptions[0]

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialSize)

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1)
  const safePage = Math.min(Math.max(1, page), totalPages)

  const resetKey =
    options?.resetDeps?.map(dep => String(dep)).join("\0") ?? ""

  useEffect(() => {
    setPage(1)
  }, [totalItems, pageSize, resetKey])

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const rangeEnd = Math.min(safePage * pageSize, totalItems)

  const pagination: PaginationState = {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    canPrevious: safePage > 1,
    canNext: safePage < totalPages,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPage(1)
    },
    nextPage: () => setPage(p => Math.min(totalPages, p + 1)),
    previousPage: () => setPage(p => Math.max(1, p - 1)),
  }

  return { pageItems, pagination }
}
