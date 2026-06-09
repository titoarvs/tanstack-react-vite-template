/**
 * EDM field policy spot-checks — runnable assertions for CI integration later.
 * Run: npx tsx src/features/employees/edm/fieldPolicy.test.ts
 */
import type { AuthUser } from "@/features/auth/types"
import type { Employee } from "../types"
import {
  canEditField,
  canViewField,
  canViewPayrollHistory,
  resolveFieldAccess,
} from "./fieldPolicy"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const employeeUser: AuthUser = {
  id: "u1",
  email: "employee@titohris.com",
  role: "employee",
  employeeId: "1",
  name: "Angela",
}

const managerUser: AuthUser = {
  id: "u2",
  email: "manager@titohris.com",
  role: "manager",
  employeeId: "2",
  name: "Budi",
}

const hrAdminUser: AuthUser = {
  id: "u3",
  email: "hr@titohris.com",
  role: "hris_admin",
  name: "Dorothy",
}

const sampleEmployee: Employee = {
  id: "1",
  employeeId: "EMP-001",
  firstName: "Angela",
  lastName: "Raharja",
  demographics: {},
  contact: { email: "a@co.com", phone: "123" },
  department: "Finance",
  position: "Accountant",
  jobTitle: "Junior Accountant",
  isManager: false,
  workLocation: "onsite",
  employmentType: "full_time",
  lifecycle: { hireDate: "2020-01-01" },
  status: "active",
  statusDetail: "regular",
  contractSignedDate: "2020-01-01",
  managerId: "2",
  compensation: { monthlySalary: 85000 },
  governmentIds: { tin: "123" },
  createdAt: "2020-01-01",
  updatedAt: "2020-01-01",
}

const directReport: Employee = {
  ...sampleEmployee,
  id: "9",
  managerId: "2",
}

export function runFieldPolicyTests() {
  assert(
    canViewField(employeeUser, "monthlySalary", "1", sampleEmployee),
    "Employee should view own salary"
  )
  assert(
    !canViewField(managerUser, "monthlySalary", "1", sampleEmployee),
    "Manager must not view report salary"
  )
  assert(
    canEditField(hrAdminUser, "monthlySalary", "1", sampleEmployee),
    "HR admin should edit salary"
  )
  assert(
    !canViewField(managerUser, "governmentIds", "1", sampleEmployee),
    "Manager must not view gov IDs"
  )
  assert(
    canViewField(employeeUser, "governmentIds", "1", sampleEmployee),
    "Employee should view own gov IDs"
  )
  assert(
    resolveFieldAccess(managerUser, "name", "9", directReport).level ===
      "limited_view",
    "Manager gets limited view on report name"
  )
  assert(
    !canViewPayrollHistory(managerUser, "9", directReport),
    "Manager must not view payroll history for reports"
  )
  assert(
    canViewPayrollHistory(employeeUser, "1", sampleEmployee),
    "Employee can view own payroll history"
  )
  assert(
    !canEditField(employeeUser, "departmentPosition", "1", sampleEmployee),
    "Employee must not edit employment details"
  )
  assert(
    !canEditField(managerUser, "departmentPosition", "1", sampleEmployee),
    "Manager must not edit report employment details"
  )
  assert(
    canEditField(hrAdminUser, "departmentPosition", "1", sampleEmployee),
    "HR admin should edit employment details"
  )
  assert(
    !canEditField(managerUser, "departmentPosition", "9", directReport),
    "Manager must not edit direct report employment details"
  )

  return "All EDM field policy tests passed."
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(runFieldPolicyTests())
}
