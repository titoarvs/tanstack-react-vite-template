import type { EmployeeUpdatePatch } from "@/lib/mock/employeeStore"
import type { Employee } from "../types"
import type { EmploymentEditFormData } from "../schemas/employmentEditSchema"

export function employeeToEmploymentForm(employee: Employee): EmploymentEditFormData {
  return {
    department: employee.department as EmploymentEditFormData["department"],
    position: employee.position,
    jobTitle: employee.jobTitle,
    isManager: employee.isManager,
    managerId: employee.managerId ?? "",
    orgLevel: employee.orgLevel ?? "",
    businessUnit: employee.businessUnit ?? "",
    costCenter: employee.costCenter ?? "",
    workLocation: employee.workLocation,
    employmentType: employee.employmentType,
    status: employee.status,
    statusDetail: employee.statusDetail,
    hireDate: employee.lifecycle.hireDate,
    probationEndDate: employee.lifecycle.probationEndDate ?? "",
    regularizationDate: employee.regularizationDate ?? "",
    contractSignedDate: employee.contractSignedDate,
    contractStartDate: employee.lifecycle.contractStartDate ?? "",
    contractEndDate: employee.lifecycle.contractEndDate ?? "",
    terminationDate: employee.lifecycle.terminationDate ?? "",
    separationReason: employee.separationReason ?? "",
  }
}

export function employmentFormToPatch(
  data: EmploymentEditFormData
): EmployeeUpdatePatch {
  return {
    department: data.department,
    position: data.position,
    jobTitle: data.jobTitle,
    isManager: data.isManager,
    managerId: data.managerId?.trim() || undefined,
    orgLevel: data.orgLevel?.trim() || undefined,
    businessUnit: data.businessUnit?.trim() || undefined,
    costCenter: data.costCenter?.trim() || undefined,
    workLocation: data.workLocation,
    employmentType: data.employmentType,
    status: data.status,
    statusDetail: data.statusDetail?.trim() || undefined,
    contractSignedDate: data.contractSignedDate,
    regularizationDate: data.regularizationDate?.trim() || undefined,
    separationReason: data.separationReason?.trim() || undefined,
    lifecycle: {
      hireDate: data.hireDate,
      probationEndDate: data.probationEndDate?.trim() || undefined,
      contractStartDate: data.contractStartDate?.trim() || undefined,
      contractEndDate: data.contractEndDate?.trim() || undefined,
      terminationDate: data.terminationDate?.trim() || undefined,
    },
  }
}
