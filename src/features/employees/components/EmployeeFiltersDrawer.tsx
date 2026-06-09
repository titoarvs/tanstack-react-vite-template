import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORK_LOCATIONS } from "../api/employeeApi"
import { defaultEmployeeFilters } from "../lib/filterUtils"
import type { EmployeeFilters as Filters } from "../types"

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface EmployeeFiltersDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Filters
  onChange: (filters: Filters) => void
}

export function EmployeeFiltersDrawer({
  open,
  onOpenChange,
  filters,
  onChange,
}: EmployeeFiltersDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter employees</SheetTitle>
          <SheetDescription>
            Narrow the directory by status, department, employment type, and work location.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <FilterSelect
            label="Status"
            value={filters.status ?? "all"}
            onValueChange={v => onChange({ ...filters, status: v as Filters["status"] })}
            options={[
              { value: "all", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pre_hire", label: "Pre-hire" },
              { value: "terminated", label: "Terminated" },
              { value: "onboarding", label: "Onboarding" },
            ]}
          />
          <FilterSelect
            label="Department"
            value={filters.department ?? "all"}
            onValueChange={v => onChange({ ...filters, department: v })}
            options={[
              { value: "all", label: "All departments" },
              ...DEPARTMENTS.map(d => ({ value: d, label: d })),
            ]}
          />
          <FilterSelect
            label="Employment type"
            value={filters.employmentType ?? "all"}
            onValueChange={v =>
              onChange({ ...filters, employmentType: v as Filters["employmentType"] })
            }
            options={[
              { value: "all", label: "All types" },
              ...EMPLOYMENT_TYPES.map(t => ({ value: t.value, label: t.label })),
            ]}
          />
          <FilterSelect
            label="Work location"
            value={filters.workLocation ?? "all"}
            onValueChange={v => onChange({ ...filters, workLocation: v as Filters["workLocation"] })}
            options={[
              { value: "all", label: "All locations" },
              ...WORK_LOCATIONS.map(w => ({ value: w.value, label: w.label })),
            ]}
          />
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onChange(defaultEmployeeFilters)}
          >
            Clear all filters
          </Button>
          <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
