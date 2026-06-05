import { z } from "zod"
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  OFFICE_BRANCHES,
  ORG_LEVELS,
  WORK_LOCATIONS,
} from "@/features/employees/data/masterData"

const departmentValues = DEPARTMENTS as unknown as [string, ...string[]]
const employmentTypeValues = EMPLOYMENT_TYPES.map(t => t.value) as [
  string,
  ...string[],
]
const officeValues = OFFICE_BRANCHES as unknown as [string, ...string[]]
const workLocationValues = WORK_LOCATIONS.map(w => w.value) as [
  string,
  ...string[],
]
const orgLevelValues = ORG_LEVELS as unknown as [string, ...string[]]

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
    managerId: z.string().optional(),
    orgLevel: z.enum(orgLevelValues).optional(),
    workLocation: z.enum(workLocationValues).optional(),
    employmentType: z.enum(employmentTypeValues),
    hireDate: z.string().min(1, "Hire date is required"),
    probationEndDate: z.string().optional(),
    contractStartDate: z.string().optional(),
    contractEndDate: z.string().optional(),
    officeBranch: z.enum(officeValues),
  })
  .superRefine((data, ctx) => {
    if (data.employmentType === "contract" || data.employmentType === "internship") {
      if (!data.contractStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contract start date is required",
          path: ["contractStartDate"],
        })
      }
      if (!data.contractEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contract end date is required",
          path: ["contractEndDate"],
        })
      }
      if (
        data.contractStartDate &&
        data.contractEndDate &&
        data.contractEndDate < data.contractStartDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Contract end must be after start",
          path: ["contractEndDate"],
        })
      }
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
  })

export const onboardingSchema = personalInfoSchema.and(employmentInfoSchema)

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>
export type EmploymentInfoForm = z.infer<typeof employmentInfoSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>

export const onboardingDefaults: Partial<OnboardingFormData> = {
  employmentType: "regular",
  gender: undefined,
  managerId: "",
  department: "Engineering",
  officeBranch: "Jakarta",
  workLocation: "office",
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
  "managerId",
  "orgLevel",
  "workLocation",
  "employmentType",
  "hireDate",
  "probationEndDate",
  "contractStartDate",
  "contractEndDate",
  "officeBranch",
] as const
