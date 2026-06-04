import { z } from "zod"

/** Required contact fields — HR may have pre-filled work email */
export const contactStepSchema = z.object({
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: z.string().optional(),
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
  acknowledgePrivacy: z
    .boolean()
    .refine(v => v === true, { message: "You must acknowledge the privacy notice" }),
})

export const profileOnboardingSchema = contactStepSchema.and(policiesStepSchema)

export type ContactStepForm = z.infer<typeof contactStepSchema>
export type PoliciesStepForm = z.infer<typeof policiesStepSchema>
export type ProfileOnboardingFormData = z.infer<typeof profileOnboardingSchema>
