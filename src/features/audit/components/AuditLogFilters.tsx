import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AUDIT_CATEGORY_LABELS } from "../auditPresentation"
import type { AuditCategory, AuditCategoryFilter } from "../types"

interface AuditLogFiltersProps {
  category: AuditCategoryFilter
  onCategoryChange: (value: AuditCategoryFilter) => void
  search: string
  onSearchChange: (value: string) => void
  totalCount: number
  filteredCount: number
}

export function AuditLogFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  totalCount,
  filteredCount,
}: AuditLogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} events
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-[12rem] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search activity…"
            className="h-9 pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={v => onCategoryChange(v as AuditCategoryFilter)}
        >
          <SelectTrigger className="h-9 w-full sm:w-[11rem]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(AUDIT_CATEGORY_LABELS) as AuditCategory[]).map(key => (
              <SelectItem key={key} value={key}>
                {AUDIT_CATEGORY_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
