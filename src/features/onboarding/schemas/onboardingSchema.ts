import { z } from "zod"
import {
  ACTIVE_STATUS_DETAILS,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  WORK_LOCATIONS,
} from "@/features/employees/data/masterData"

const departmentValues = DEPARTMENTS as unknown as [string, ...string[]]
const employmentTypeValues = EMPLOYMENT_TYPES.map(t => t.value) as [
  string,
  ...string[],
]
const workLocationValues = WORK_LOCATIONS.map(w => w.value) as [
  string,
  ...string[],
]
const statusDetailValues = ACTIVE_STATUS_DETAILS.map(s => s.value) as [
  string,
  ...string[],
]

export const personalInfoSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  email: z.string().email("Valid email is required"),
})

export const employmentInfoSchema = z
  .object({
    department: z.enum(departmentValues),
    position: z.string().min(1, "Position is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    isManager: z.boolean(),
    managerId: z.string().optional(),
    workLocation: z.enum(workLocationValues),
    employmentType: z.enum(employmentTypeValues),
    statusDetail: z.enum(statusDetailValues),
    hireDate: z.string().min(1, "Hire date is required"),
    probationEndDate: z.string().optional(),
    regularizationDate: z.string().optional(),
    contractSignedDate: z.string().min(1, "Date contract signed is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.managerId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Supervisor / manager is required",
        path: ["managerId"],
      })
    }
    const hire = new Date(data.hireDate)
    const maxFuture = new Date()
    maxFuture.setFullYear(maxFuture.getFullYear() + 1)
    if (hire > maxFuture) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hire date cannot be more than 1 year in the future",
        path: ["hireDate"],
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

export const onboardingSchema = personalInfoSchema.and(employmentInfoSchema)

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>
export type EmploymentInfoForm = z.infer<typeof employmentInfoSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>

export const onboardingDefaults: Partial<OnboardingFormData> = {
  employmentType: "full_time",
  statusDetail: "probationary",
  gender: undefined,
  managerId: "",
  isManager: false,
  department: "Engineering",
  workLocation: "onsite",
}

export const personalInfoFields = [
  "employeeId",
  "firstName",
  "middleName",
  "lastName",
  "suffix",
  "dateOfBirth",
  "gender",
  "nationality",
  "maritalStatus",
  "email",
] as const

export const employmentInfoFields = [
  "department",
  "position",
  "jobTitle",
  "isManager",
  "managerId",
  "workLocation",
  "employmentType",
  "statusDetail",
  "hireDate",
  "probationEndDate",
  "regularizationDate",
  "contractSignedDate",
] as const
