/**
 * Employment model helpers — runnable assertions.
 * Run: npx tsx src/features/employees/lib/employmentModel.test.ts
 */
import type { Employee } from "../types"
import { getManagersForDepartment } from "./managerOptions"
import {
  computeProbationEnd,
  computeRegularizationDate,
  normalizeEmployee,
} from "./employeeCalculations"
import {
  getCreateFormStatusDetailOptions,
  resolveStatusForCreate,
} from "./employmentStatus"
import { getFullStatusLabel, isActiveSubStatus } from "../data/masterData"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const managers: Employee[] = [
  {
    id: "m1",
    employeeId: "EMP-100",
    firstName: "Citra",
    lastName: "Wijaya",
    demographics: {},
    contact: { email: "citra@co.com", phone: "1" },
    department: "Engineering",
    position: "Engineering Manager",
    jobTitle: "Engineering Manager",
    isManager: true,
    workLocation: "onsite",
    employmentType: "full_time",
    lifecycle: { hireDate: "2018-01-01" },
    status: "active",
    contractSignedDate: "2018-01-01",
    createdAt: "2018-01-01",
    updatedAt: "2018-01-01",
  },
  {
    id: "m2",
    employeeId: "EMP-101",
    firstName: "Eko",
    lastName: "Hartono",
    demographics: {},
    contact: { email: "eko@co.com", phone: "2" },
    department: "Marketing",
    position: "Marketing Director",
    jobTitle: "Marketing Director",
    isManager: true,
    workLocation: "hybrid",
    employmentType: "full_time",
    lifecycle: { hireDate: "2016-01-01" },
    status: "active",
    contractSignedDate: "2016-01-01",
    createdAt: "2016-01-01",
    updatedAt: "2016-01-01",
  },
]

export function runEmploymentModelTests() {
  const engManagers = getManagersForDepartment(managers, "Engineering")
  assert(engManagers.length === 1, "Engineering should have one manager")
  assert(engManagers[0].id === "m1", "Engineering manager should be Citra")

  const emptyDeptManagers = getManagersForDepartment(managers, "")
  assert(emptyDeptManagers.length === 2, "Empty department falls back to all managers")

  const probationEnd = computeProbationEnd("2024-01-15")
  assert(probationEnd === "2024-07-15", "Probation end should be 6 months after hire")

  const regularization = computeRegularizationDate("2024-01-15", "2024-07-15")
  assert(regularization === "2024-07-16", "Regularization is day after probation end")

  const resolved = resolveStatusForCreate("probationary")
  assert(resolved.status === "active", "Create form maps to active status")
  assert(resolved.statusDetail === "probationary", "Create form keeps sub-status")

  assert(isActiveSubStatus("regular"), "regular is active sub-status")
  assert(!isActiveSubStatus("on_leave"), "on_leave is not active sub-status")

  assert(
    getFullStatusLabel("active", "probationary") === "Active (Probationary)",
    "Full status label"
  )

  const options = getCreateFormStatusDetailOptions()
  assert(options.length === 2, "Create form exposes Regular and Probationary")

  const legacy = normalizeEmployee({
    id: "x",
    employeeId: "EMP-999",
    firstName: "Legacy",
    lastName: "User",
    demographics: {},
    contact: { email: "l@co.com", phone: "9" },
    department: "Engineering",
    position: "Engineer",
    employmentType: "regular",
    lifecycle: { hireDate: "2020-06-01" },
    status: "on_leave",
    officeBranch: "Jakarta",
    createdAt: "2020-06-01",
    updatedAt: "2020-06-01",
  } as Employee)

  assert(legacy.employmentType === "full_time", "Legacy regular maps to full_time")
  assert(legacy.status === "inactive", "Legacy on_leave maps to inactive")
  assert(legacy.statusDetail === "on_leave", "Legacy on_leave detail preserved")
  assert(legacy.workLocation === "onsite", "Legacy office branch maps to onsite")
  assert(legacy.jobTitle === "Engineer", "jobTitle defaults to position")

  console.log("employmentModel.test.ts: all assertions passed")
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmploymentModelTests()
}
