import { Filter, Search } from "lucide-react"
import type { ChangeEvent } from "react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { countActiveFilters } from "../lib/filterUtils"
import type { EmployeeFilters as Filters } from "../types"
import { EmployeeFiltersDrawer } from "./EmployeeFiltersDrawer"

interface EmployeeFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function EmployeeFiltersPanel({ filters, onChange }: EmployeeFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or ID…"
            value={filters.search ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ ...filters, search: e.target.value })
            }
            className="h-10 pl-10"
            aria-label="Search employees"
          />
        </div>
        <Button
          variant="outline"
          type="button"
          className="h-10 shrink-0 gap-2"
          onClick={() => setDrawerOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>

      <EmployeeFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        filters={filters}
        onChange={onChange}
      />
    </>
  )
}
