import { EmployeeCard } from "./EmployeeCard"
import { EmployeeTable } from "./EmployeeTable"
import type { EmployeeViewMode } from "./EmployeeViewToggle"
import type { Employee } from "../types"

interface EmployeeDirectoryViewsProps {
  employees: Employee[]
  viewMode: EmployeeViewMode
  resetKey?: string
}

export function EmployeeDirectoryViews({
  employees,
  viewMode,
  resetKey,
}: EmployeeDirectoryViewsProps) {
  if (viewMode === "table") {
    return <EmployeeTable employees={employees} resetKey={resetKey} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {employees.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  )
}

export function EmployeeDirectorySkeleton({ viewMode }: { viewMode: EmployeeViewMode }) {
  if (viewMode === "table") {
    return (
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="h-11 animate-pulse border-b border-border bg-muted/50" />
        <div className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[3.25rem] animate-pulse bg-muted/20" />
          ))}
        </div>
        <div className="h-[3.25rem] animate-pulse border-t border-border bg-muted/20" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  )
}
