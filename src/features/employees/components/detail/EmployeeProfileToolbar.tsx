import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"
import type { ProfileTabValue } from "./EmployeeProfileHeader"
import type { Employee } from "../../types"
import { getFullName } from "../../types"
import { EmployeeDeleteDialog } from "../EmployeeDeleteDialog"
import { useDeleteEmployee } from "../../hooks/useEmployees"
import type { useEmployeeProfileNav } from "../../hooks/useEmployeeProfileNav"

interface VisibleProfileTab {
  value: ProfileTabValue
  label: string
}

interface EmployeeProfileToolbarProps {
  employee: Employee
  nav: ReturnType<typeof useEmployeeProfileNav>
  visibleTabs: VisibleProfileTab[]
  showSelfService: boolean
  showPayPeriod: boolean
  periodEndLabel: string
}

export function EmployeeProfileToolbar({
  employee,
  visibleTabs,
}: EmployeeProfileToolbarProps) {
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteEmployee = useDeleteEmployee()
  const name = getFullName(employee)

  return (
    <>
      <Card className="sticky top-0 z-10 overflow-hidden border-border/80 bg-card shadow-sm">
        <div className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="profile-tabs-scroll -mx-1 min-w-0 px-1">
            <TabsList className="inline-flex h-auto w-max gap-1 rounded-lg bg-muted/40 p-1">
              {visibleTabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-xs font-semibold shadow-none sm:px-4 sm:text-sm",
                    "text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* <div className="flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {nav.total > 0 && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>
                  {nav.position} of {nav.total}
                </span>
                <span className="hidden sm:inline text-border">·</span>
                {nav.prev ? (
                  <Link
                    to="/employees/$employeeId"
                    params={{ employeeId: nav.prev.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="opacity-40">Previous</span>
                )}
                <span className="text-border">|</span>
                {nav.next ? (
                  <Link
                    to="/employees/$employeeId"
                    params={{ employeeId: nav.next.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="opacity-40">Next</span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {showSelfService && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <span className="truncate">Request a change</span>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Update job information</DropdownMenuItem>
                    <DropdownMenuItem>Update contact details</DropdownMenuItem>
                    <DropdownMenuItem>Report an issue</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {showPayPeriod && (
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    readOnly
                    value={periodEndLabel}
                    className="h-9 w-[8.5rem] pl-9 text-sm"
                    aria-label="Pay period end date"
                  />
                </div>
              )}

              <EmployeeActionsMenu
                employeeId={employee.id}
                onDelete={() => setConfirmDelete(true)}
              />
            </div>
          </div> */}
        </div>
      </Card>

      <EmployeeDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        employeeName={name}
        onConfirm={() =>
          deleteEmployee.mutate(employee.id, {
            onSuccess: () => navigate({ to: "/employees/directory" }),
          })
        }
      />
    </>
  )
}
