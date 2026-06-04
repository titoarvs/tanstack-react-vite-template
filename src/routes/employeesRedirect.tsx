import { Navigate } from "@tanstack/react-router"
import { getEmployeeNavTarget } from "@/features/auth/accessPolicy"
import { can, PERMISSIONS } from "@/features/auth/permissions"
import { getSession } from "@/features/auth/authStorage"

export function EmployeesIndexRedirect() {
  const user = getSession()
  if (user?.employeeId && can(user, PERMISSIONS.EMPLOYEES_VIEW_OWN) && !can(user, PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY)) {
    return (
      <Navigate
        to="/employees/$employeeId"
        params={{ employeeId: user.employeeId }}
      />
    )
  }
  return <Navigate to={getEmployeeNavTarget(user)} />
}
