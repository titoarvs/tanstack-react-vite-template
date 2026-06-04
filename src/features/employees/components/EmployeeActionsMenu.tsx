import { Link } from "@tanstack/react-router"
import { MoreVertical } from "lucide-react"
import { PERMISSIONS } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EmployeeActionsMenuProps {
  employeeId: string
  onDelete: () => void
}

export function EmployeeActionsMenu({ employeeId, onDelete }: EmployeeActionsMenuProps) {
  const { can } = useAuth()
  const canDelete = can(PERMISSIONS.EMPLOYEES_DELETE)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Actions">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            to="/employees/$employeeId"
            params={{ employeeId }}
            className="cursor-pointer"
          >
            Details
          </Link>
        </DropdownMenuItem>
        {canDelete && (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={onDelete}
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
