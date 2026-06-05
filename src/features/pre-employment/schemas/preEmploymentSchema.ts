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

export const createInviteSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  intendedDepartment: z.enum(departmentValues).optional(),
  intendedPosition: z.string().optional(),
  intendedHireDate: z.string().optional(),
})

export const contactStepSchema = z.object({
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: z.string().optional(),
  province: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
})

export const emergencyStepSchema = z.object({
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  preferredName: z.string().optional(),
  personalEmail: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
})

export const policiesStepSchema = z.object({
  photoUrl: z.string().optional(),
  acknowledgeHandbook: z
    .boolean()
    .refine(v => v === true, { message: "You must acknowledge the employee handbook" }),
  acknowledgePrivacy: z
    .boolean()
    .refine(v => v === true, { message: "You must acknowledge the privacy notice" }),
})

export const preEmploymentFormSchema = contactStepSchema
  .merge(emergencyStepSchema)
  .merge(policiesStepSchema)

export const approveEmploymentSchema = z
  .object({
    employeeId: z.string().min(1, "Employee ID is required"),
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
    }
  })

export type CreateInviteFormData = z.infer<typeof createInviteSchema>
export type ApproveEmploymentFormData = z.infer<typeof approveEmploymentSchema>
