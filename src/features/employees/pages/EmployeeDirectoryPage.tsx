import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { filterEmployees } from "../api/employeeApi"
import {
  EmployeeDirectorySkeleton,
  EmployeeDirectoryViews,
} from "../components/EmployeeDirectoryViews"
import { EmployeeFiltersPanel } from "../components/EmployeeFilters"
import { EmployeeViewToggle } from "../components/EmployeeViewToggle"
import { PERMISSIONS } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { useEmployees } from "../hooks/useEmployees"
import { useEmployeeViewMode } from "../hooks/useEmployeeViewMode"
import type { EmployeeFilters } from "../types"

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function EmployeeDirectoryPage() {
  const { can } = useAuth()
  const canCreateEmployee = can(PERMISSIONS.EMPLOYEES_CREATE)
  const { data: employees, isLoading, isError } = useEmployees()
  const { viewMode, setViewMode } = useEmployeeViewMode()
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    status: "all",
    department: "all",
    employmentType: "all",
    officeBranch: "all",
  })
  const debouncedSearch = useDebouncedValue(filters.search ?? "", 300)
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  )

  const filtered = useMemo(
    () => filterEmployees(employees ?? [], effectiveFilters),
    [employees, effectiveFilters]
  )

  const activeTab = viewMode === "grid" ? "directory" : "list"
  const resultCount = filtered.length
  const filterResetKey = `${debouncedSearch}|${filters.status}|${filters.department}|${filters.employmentType}|${filters.officeBranch}`

  return (
    <PageContent>
      <PageHeader
        title="Employee"
        className="hidden lg:flex"
        action={
          canCreateEmployee ? (
            <Button asChild>
              <Link to="/employees/onboarding">
                <Plus className="h-4 w-4" />
                Add New Employee
              </Link>
            </Button>
          ) : undefined
        }
      />
      {canCreateEmployee && (
        <div className="mb-4 lg:hidden">
          <Button asChild className="w-full">
            <Link to="/employees/onboarding">
              <Plus className="h-4 w-4" />
              Add New Employee
            </Link>
          </Button>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={v => setViewMode(v === "directory" ? "grid" : "table")}
        className="w-full"
      >
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="list"
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Employee List
          </TabsTrigger>
          <TabsTrigger
            value="directory"
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Directory
          </TabsTrigger>
          <TabsTrigger
            value="org"
            disabled
            className="rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 shadow-none data-[state=active]:border-transparent data-[disabled]:opacity-40"
          >
            ORG Chart
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <EmployeeFiltersPanel filters={filters} onChange={setFilters} />
        </div>
        <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {resultCount} {resultCount === 1 ? "employee" : "employees"}
            </p>
          )}
          <EmployeeViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <div className="mt-4">
        {isLoading && <EmployeeDirectorySkeleton viewMode={viewMode} />}
        {isError && (
          <p className="text-sm text-destructive">Failed to load employees. Please refresh.</p>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card py-16 text-center">
            <p className="text-muted-foreground">No employees match your filters.</p>
            {canCreateEmployee && (
              <Button asChild variant="secondary" className="mt-4">
                <Link to="/employees/onboarding">Add New Employee</Link>
              </Button>
            )}
          </div>
        )}
        {!isLoading && filtered.length > 0 && (
          <EmployeeDirectoryViews
            employees={filtered}
            viewMode={viewMode}
            resetKey={filterResetKey}
          />
        )}
      </div>
    </PageContent>
  )
}
