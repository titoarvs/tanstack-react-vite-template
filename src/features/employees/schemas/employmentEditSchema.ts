import { z } from "zod"
import {
  ACTIVE_STATUS_DETAILS,
  DEPARTMENTS,
  EMPLOYEE_STATUSES,
  EMPLOYMENT_TYPES,
  INACTIVE_STATUS_DETAILS,
  WORK_LOCATIONS,
} from "../data/masterData"

const departmentValues = DEPARTMENTS as unknown as [string, ...string[]]
const employmentTypeValues = EMPLOYMENT_TYPES.map(t => t.value) as [
  string,
  ...string[],
]
const workLocationValues = WORK_LOCATIONS.map(w => w.value) as [
  string,
  ...string[],
]
const statusValues = EMPLOYEE_STATUSES.map(s => s.value) as [
  string,
  ...string[],
]
const statusDetailValues = [
  ...ACTIVE_STATUS_DETAILS,
  ...INACTIVE_STATUS_DETAILS,
].map(s => s.value) as [string, ...string[]]

export const employmentEditSchema = z
  .object({
    department: z.enum(departmentValues),
    position: z.string().min(1, "Position is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    isManager: z.boolean(),
    managerId: z.string().optional(),
    orgLevel: z.string().optional(),
    businessUnit: z.string().optional(),
    costCenter: z.string().optional(),
    workLocation: z.enum(workLocationValues),
    employmentType: z.enum(employmentTypeValues),
    status: z.enum(statusValues),
    statusDetail: z.union([z.enum(statusDetailValues), z.literal("")]).optional(),
    hireDate: z.string().min(1, "Hire date is required"),
    probationEndDate: z.string().optional(),
    regularizationDate: z.string().optional(),
    contractSignedDate: z.string().min(1, "Date contract signed is required"),
    contractStartDate: z.string().optional(),
    contractEndDate: z.string().optional(),
    terminationDate: z.string().optional(),
    separationReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isManager && !data.managerId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Manager is required when employee is not a manager",
        path: ["managerId"],
      })
    }
    if (data.contractSignedDate && data.hireDate && data.contractSignedDate < data.hireDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contract signed date cannot be before hire date",
        path: ["contractSignedDate"],
      })
    }
  })

export type EmploymentEditFormData = z.infer<typeof employmentEditSchema>
