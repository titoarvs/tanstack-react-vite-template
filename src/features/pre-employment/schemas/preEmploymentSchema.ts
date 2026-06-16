import { z } from "zod"
import {
  ACTIVE_STATUS_DETAILS,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  WORK_LOCATIONS,
} from "@/features/employees/data/masterData"
import {
  buildRequirementContextFromInvite,
  validateContractSignatures,
  validateRequiredUploads,
} from "@/features/employees/lib/documentRequirementPolicy"
import { addressSchema } from "@/features/employees/lib/address"
import type { UploadedDocumentRef } from "@/features/employees/lib/documentRequirementPolicy"
import type { PreEmploymentInvite } from "../types"

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

export const createInviteSchema = z
  .object({
    email: z.string().email("Valid email is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    intendedDepartment: z.enum(departmentValues).optional(),
    intendedPosition: z.string().optional(),
    intendedHireDate: z.string().optional(),
    intendedEmploymentType: z.enum(employmentTypeValues),
    intendedWorkLocation: z.enum(workLocationValues),
    isAcademicInternship: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.intendedEmploymentType !== "intern" && data.isAcademicInternship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Academic internship applies to intern hires only",
        path: ["isAcademicInternship"],
      })
    }
  })

export const contactStepSchema = z.object({
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  address: addressSchema.optional(),
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

const preEmploymentDocumentSchema = z.object({
  id: z.string(),
  type: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  uploadedAt: z.string(),
  dataUrl: z.string().optional(),
})

const contractSignatureSchema = z.object({
  contractType: z.enum(["job_offer", "employment_contract", "moa"]),
  signedName: z.string().min(1),
  signedAt: z.string(),
  documentVersion: z.string(),
  ipAddress: z.string().optional(),
  signatureDataUrl: z.string().optional(),
  hrCountersignedBy: z.string().optional(),
  hrCountersignedAt: z.string().optional(),
  hrSignatureDataUrl: z.string().optional(),
})

export const documentsStepSchema = z.object({
  uploadedDocuments: z.array(preEmploymentDocumentSchema),
})

export const contractsStepSchema = z.object({
  contractSignatures: z.array(contractSignatureSchema),
})

export const policiesStepSchema = z.object({
  photoUrl: z.string().optional(),
  acknowledgeHandbook: z
    .boolean()
    .refine(v => v === true, { message: "You must acknowledge the employee handbook" }),
})

export const preEmploymentFormSchema = contactStepSchema
  .merge(emergencyStepSchema)
  .merge(documentsStepSchema)
  .merge(contractsStepSchema)
  .merge(policiesStepSchema)

export function createDocumentsStepSchema(invite: PreEmploymentInvite) {
  return documentsStepSchema.superRefine((data, ctx) => {
    const requirementCtx = buildRequirementContextFromInvite({
      ...invite,
      candidatePayload: { maritalStatus: undefined },
    })
    const result = validateRequiredUploads(
      { ...requirementCtx, maritalStatus: undefined },
      data.uploadedDocuments as UploadedDocumentRef[]
    )
    if (!result.valid) {
      result.errors.forEach(message => {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["uploadedDocuments"] })
      })
    }
  })
}

export function createDocumentsStepSchemaWithMarital(
  invite: PreEmploymentInvite,
  maritalStatus?: string
) {
  return documentsStepSchema.superRefine((data, ctx) => {
    const requirementCtx = buildRequirementContextFromInvite({
      ...invite,
      candidatePayload: { maritalStatus },
    })
    const result = validateRequiredUploads(requirementCtx, data.uploadedDocuments as UploadedDocumentRef[])
    if (!result.valid) {
      result.errors.forEach(message => {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["uploadedDocuments"] })
      })
    }
  })
}

export function createContractsStepSchema(invite: PreEmploymentInvite) {
  return contractsStepSchema.superRefine((data, ctx) => {
    const ctxReq = buildRequirementContextFromInvite(invite)
    const result = validateContractSignatures(ctxReq, data.contractSignatures)
    if (!result.valid) {
      result.errors.forEach(message => {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["contractSignatures"] })
      })
    }
  })
}

export const approveEmploymentSchema = z
  .object({
    employeeId: z.string().min(1, "Employee ID is required"),
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
    if (data.contractSignedDate && data.hireDate && data.contractSignedDate < data.hireDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contract signed date cannot be before hire date",
        path: ["contractSignedDate"],
      })
    }
  })

export type CreateInviteFormData = z.infer<typeof createInviteSchema>
export type ApproveEmploymentFormData = z.infer<typeof approveEmploymentSchema>
