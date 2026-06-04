import { LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type EmployeeViewMode = "grid" | "table"

interface EmployeeViewToggleProps {
  value: EmployeeViewMode
  onChange: (mode: EmployeeViewMode) => void
  className?: string
}

export function EmployeeViewToggle({ value, onChange, className }: EmployeeViewToggleProps) {
  return (
    <div
      className={cn("inline-flex rounded-lg border bg-muted/50 p-1", className)}
      role="group"
      aria-label="View mode"
    >
      <Button
        type="button"
        variant={value === "table" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5 px-3"
        onClick={() => onChange("table")}
        aria-pressed={value === "table"}
      >
        <Table className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </Button>
      <Button
        type="button"
        variant={value === "grid" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5 px-3"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </Button>
    </div>
  )
}
