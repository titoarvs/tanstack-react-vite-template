/**
 * Document requirement policy tests.
 * Run: npx tsx src/features/employees/lib/documentRequirementPolicy.test.ts
 */
import {
  buildRequirementContextFromInvite,
  getContractSigningRequirements,
  getRequiredContractTypes,
  getUploadRequirementsForPortal,
  validateContractSignatures,
  validateRequiredUploads,
} from "./documentRequirementPolicy"
import type { UploadedDocumentRef } from "./documentRequirementPolicy"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const fullTimeOnsite = {
  employmentType: "full_time" as const,
  workLocation: "onsite" as const,
}

const partTimeRemote = {
  employmentType: "part_time" as const,
  workLocation: "remote" as const,
}

const academicIntern = {
  employmentType: "intern" as const,
  workLocation: "onsite" as const,
  isAcademicInternship: true,
}

const uploads = (types: string[]): UploadedDocumentRef[] =>
  types.map(type => ({ type: type as UploadedDocumentRef["type"] }))

// Full-time requires NBI, birth cert, medical, gov forms
const ftUploads = getUploadRequirementsForPortal(fullTimeOnsite)
assert(
  ftUploads.some(r => r.type === "nbi_clearance" && r.priority === "required"),
  "full-time requires NBI"
)
assert(
  ftUploads.some(r => r.type === "birth_certificate" && r.priority === "required"),
  "full-time requires birth certificate"
)
assert(
  ftUploads.some(r => r.type === "medical_certificate" && r.priority === "required"),
  "full-time requires medical"
)
assert(
  ftUploads.some(r => r.type === "sss_e1" && r.priority === "required"),
  "full-time requires SSS"
)

// Part-time remote: no medical, 2 valid IDs
const ptUploads = getUploadRequirementsForPortal(partTimeRemote)
assert(
  !ptUploads.some(
    r => r.type === "medical_certificate" && r.priority === "required"
  ),
  "part-time remote skips medical"
)
const validIdReq = ptUploads.find(r => r.type === "valid_id" && r.priority === "required")
assert(validIdReq?.minCount === 2, "part-time requires 2 valid IDs")

const ptValidation = validateRequiredUploads(partTimeRemote, uploads(["valid_id"]))
assert(!ptValidation.valid, "one valid ID fails part-time validation")

const ptValidationOk = validateRequiredUploads(
  partTimeRemote,
  uploads(["valid_id", "valid_id"])
)
assert(
  ptValidationOk.errors.every(e => !e.includes("Valid Government ID")),
  "two valid IDs satisfy part-time ID rule"
)

// Intern academic: student ID + MOA contract
const internUploads = getUploadRequirementsForPortal(academicIntern)
assert(
  internUploads.some(r => r.type === "student_id" && r.priority === "required"),
  "intern requires student ID"
)
const contractTypes = getRequiredContractTypes(academicIntern)
assert(contractTypes.includes("moa"), "academic intern requires MOA signature")
assert(
  getContractSigningRequirements(academicIntern).length >= 3,
  "intern has job offer, contract, and MOA"
)

// Married secondary marriage cert
const marriedCtx = {
  ...fullTimeOnsite,
  maritalStatus: "married",
}
assert(
  getUploadRequirementsForPortal(marriedCtx).some(
    r => r.type === "marriage_certificate" && r.priority === "secondary"
  ),
  "married shows secondary marriage certificate"
)

// Contract signatures
const sigValidation = validateContractSignatures(fullTimeOnsite, [
  { contractType: "job_offer" },
])
assert(!sigValidation.valid, "missing employment contract signature")

const sigOk = validateContractSignatures(fullTimeOnsite, [
  { contractType: "job_offer" },
  { contractType: "employment_contract" },
])
assert(sigOk.valid, "job offer + employment contract signed")

// Invite context builder
const inviteCtx = buildRequirementContextFromInvite({
  intendedEmploymentType: "intern",
  intendedWorkLocation: "remote",
  isAcademicInternship: true,
  candidatePayload: { maritalStatus: "single" },
})
assert(inviteCtx.employmentType === "intern", "invite context employment type")
assert(inviteCtx.workLocation === "remote", "invite context work location")

console.log("documentRequirementPolicy.test.ts — all assertions passed")
