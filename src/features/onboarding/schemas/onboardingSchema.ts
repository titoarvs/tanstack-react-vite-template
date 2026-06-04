import { z } from "zod"

export const personalInfoSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: z.string().optional(),
  photoUrl: z.string().optional(),
})

export const employmentInfoSchema = z
  .object({
    department: z.string().min(1, "Department is required"),
    departmentOther: z.string().optional(),
    position: z.string().min(1, "Position is required"),
    managerId: z.string().optional(),
    employmentType: z.enum(["full-time", "internship", "contract"]),
    hireDate: z.string().min(1, "Hire date is required"),
    probationEndDate: z.string().optional(),
    contractStartDate: z.string().optional(),
    contractEndDate: z.string().optional(),
    officeBranch: z.string().min(1, "Office branch is required"),
  })
  .superRefine((data, ctx) => {
    if (data.department === "Other" && !data.departmentOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify department",
        path: ["departmentOther"],
      })
    }
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

/** Full onboarding form validated on submit via zodResolver */
export const onboardingSchema = personalInfoSchema.and(employmentInfoSchema)

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>
export type EmploymentInfoForm = z.infer<typeof employmentInfoSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>

export const onboardingDefaults: Partial<OnboardingFormData> = {
  employmentType: "full-time",
  gender: undefined,
  managerId: "",
  department: "Engineering",
  officeBranch: "Jakarta",
}

export const personalInfoFields = [
  "employeeId",
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "nationality",
  "maritalStatus",
  "email",
  "phone",
  "address",
  "photoUrl",
] as const

export const employmentInfoFields = [
  "department",
  "departmentOther",
  "position",
  "managerId",
  "employmentType",
  "hireDate",
  "probationEndDate",
  "contractStartDate",
  "contractEndDate",
  "officeBranch",
] as const
