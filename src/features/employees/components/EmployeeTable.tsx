import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  PaginatedTableShell,
  TABLE_ROW_HEIGHT_PX,
} from "@/components/ui/paginated-data-table"
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { usePagination } from "@/lib/pagination/usePagination"
import { useDeleteEmployee } from "../hooks/useEmployees"
import type { Employee } from "../types"
import { getEmploymentTypeLabel, getFullName } from "../types"
import { EmployeeActionsMenu } from "./EmployeeActionsMenu"
import { EmployeeDeleteDialog } from "./EmployeeDeleteDialog"

const COLUMN_COUNT = 8

interface EmployeeTableProps {
  employees: Employee[]
  /** Resets to page 1 when directory filters change */
  resetKey?: string
}

function EmployeeTableRow({ employee }: { employee: Employee }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteEmployee = useDeleteEmployee()
  const name = getFullName(employee)
  const typeVariant = employee.employmentType as "full-time" | "internship" | "contract"

  return (
    <>
      <TableRow>
        <TableCell>
          <Link
            to="/employees/$employeeId"
            params={{ employeeId: employee.id }}
            className="flex min-w-[12rem] items-center gap-3"
          >
            <EmployeeAvatar src={employee.photoUrl} name={name} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{employee.employeeId}</p>
            </div>
          </Link>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <p className="max-w-[10rem] truncate font-medium">{employee.position}</p>
          <p className="max-w-[10rem] truncate text-xs text-muted-foreground">
            {employee.department}
          </p>
        </TableCell>
        <TableCell>
          <Badge variant={employee.status === "active" ? "active" : "inactive"}>
            {employee.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <Badge variant={typeVariant}>{getEmploymentTypeLabel(employee.employmentType)}</Badge>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <span className="whitespace-nowrap">{employee.officeBranch}</span>
        </TableCell>
        <TableCell className="hidden xl:table-cell">
          <span className="whitespace-nowrap">{employee.contact.phone}</span>
        </TableCell>
        <TableCell className="hidden min-w-[10rem] lg:table-cell">
          <span className="block max-w-[14rem] truncate" title={employee.contact.email}>
            {employee.contact.email}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <EmployeeActionsMenu
            employeeId={employee.id}
            onDelete={() => setConfirmDelete(true)}
          />
        </TableCell>
      </TableRow>

      <EmployeeDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        employeeName={name}
        onConfirm={() => deleteEmployee.mutate(employee.id)}
      />
    </>
  )
}

export function EmployeeTable({ employees, resetKey }: EmployeeTableProps) {
  const { pageItems, pagination } = usePagination(employees, {
    initialPageSize: 10,
    resetDeps: [resetKey],
  })

  return (
    <PaginatedTableShell
      pagination={pagination}
      columnCount={COLUMN_COUNT}
      filledRowCount={pageItems.length}
      minWidth="720px"
      header={
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-foreground">Employee</TableHead>
          <TableHead className="hidden text-foreground md:table-cell">Role</TableHead>
          <TableHead className="text-foreground">Status</TableHead>
          <TableHead className="hidden text-foreground lg:table-cell">Type</TableHead>
          <TableHead className="hidden text-foreground sm:table-cell">Branch</TableHead>
          <TableHead className="hidden text-foreground xl:table-cell">Phone</TableHead>
          <TableHead className="hidden text-foreground lg:table-cell">Email</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Actions</span>
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
              No employees match your filters.
            </div>
          </TableCell>
        </TableRow>
      ) : (
        pageItems.map(employee => (
          <EmployeeTableRow key={employee.id} employee={employee} />
        ))
      )}
    </PaginatedTableShell>
  )
}
