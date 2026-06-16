import { z } from "zod"
import { addressSchema } from "@/features/employees/lib/address"
import type { Employee } from "@/features/employees/types"
import { getFirstDayRequirements } from "@/features/employees/lib/documentRequirementPolicy"

/** Required contact fields — HR may have pre-filled work email */
export const contactStepSchema = z.object({
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: addressSchema.optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
})

export const policiesStepSchema = z.object({
  preferredName: z.string().optional(),
  personalEmail: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
  photoUrl: z.string().optional(),
  acknowledgeHandbook: z
    .boolean()
    .refine(v => v === true, { message: "You must acknowledge the employee handbook" }),
})

export const complianceStepSchema = z.object({
  acknowledgeNda: z.boolean().optional(),
  acknowledgeNonCompete: z.boolean().optional(),
  acknowledgeAcceptableUse: z.boolean().optional(),
})

export function createComplianceStepSchema(employee: Employee) {
  const ctx = {
    employmentType: employee.employmentType,
    workLocation: employee.workLocation,
    maritalStatus: employee.demographics?.maritalStatus,
  }
  const reqs = getFirstDayRequirements(ctx)

  return complianceStepSchema.superRefine((data, ctxRef) => {
    for (const req of reqs) {
      if (req.type === "nda" && data.acknowledgeNda !== true) {
        ctxRef.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NDA acknowledgement is required",
          path: ["acknowledgeNda"],
        })
      }
      if (req.type === "non_compete" && data.acknowledgeNonCompete !== true) {
        ctxRef.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Non-compete acknowledgement is required",
          path: ["acknowledgeNonCompete"],
        })
      }
      if (req.type === "acceptable_use_policy" && data.acknowledgeAcceptableUse !== true) {
        ctxRef.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Acceptable Use Policy acknowledgement is required",
          path: ["acknowledgeAcceptableUse"],
        })
      }
    }
  })
}

export const profileOnboardingSchema = contactStepSchema
  .merge(policiesStepSchema)
  .merge(complianceStepSchema)

export type ContactStepForm = z.infer<typeof contactStepSchema>
export type PoliciesStepForm = z.infer<typeof policiesStepSchema>
export type ProfileOnboardingFormData = z.infer<typeof profileOnboardingSchema>
