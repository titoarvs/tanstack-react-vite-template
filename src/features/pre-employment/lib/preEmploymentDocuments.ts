import {
  buildRequirementContextFromInvite,
  contractTypeFromDocumentType,
  CONTRACT_TYPE_TO_DOCUMENT,
  getRequiredContractTypes,
  validateContractSignatures,
  validateRequiredUploads,
  type DocumentRequirement,
} from "@/features/employees/lib/documentRequirementPolicy"
import type { EmployeeDocument } from "@/features/employees/types/documents"
import type {
  ContractSignatureRecord,
  PreEmploymentDocument,
  PreEmploymentFormData,
  PreEmploymentInvite,
} from "../types"

export function mapPreEmploymentToEmployeeDocuments(
  payload: PreEmploymentFormData,
  hrCountersignatures: ContractSignatureRecord[] = [],
  uploadedBy: string
): EmployeeDocument[] {
  const docs: EmployeeDocument[] = []
  let version = 1

  for (const upload of payload.uploadedDocuments ?? []) {
    docs.push({
      id: upload.id,
      type: upload.type,
      fileName: upload.fileName,
      uploadedBy,
      uploadedAt: upload.uploadedAt,
      version,
      mimeType: upload.mimeType,
      dataUrl: upload.dataUrl,
    })
    version += 1
  }

  const countersignByType = new Map(
    hrCountersignatures.map(s => [s.contractType, s])
  )

  for (const sig of payload.contractSignatures ?? []) {
    const docType = CONTRACT_TYPE_TO_DOCUMENT[sig.contractType]
    const hrSig = countersignByType.get(sig.contractType)
    docs.push({
      id: crypto.randomUUID(),
      type: docType,
      fileName: `${docType}-signed.png`,
      uploadedBy: sig.signedName,
      uploadedAt: sig.signedAt,
      version,
      mimeType: "image/png",
      dataUrl: sig.signatureDataUrl,
      signedName: sig.signedName,
      signedAt: sig.signedAt,
      documentVersion: sig.documentVersion,
      hrCountersignedBy: hrSig?.hrCountersignedBy,
      hrCountersignedAt: hrSig?.hrCountersignedAt,
    })
    version += 1
  }

  return docs
}

export function validateInviteForApproval(
  invite: PreEmploymentInvite,
  hrCountersignatures: ContractSignatureRecord[]
): { valid: boolean; errors: string[] } {
  const payload = invite.candidatePayload as PreEmploymentFormData
  const ctx = buildRequirementContextFromInvite(invite)
  const uploadResult = validateRequiredUploads(ctx, payload.uploadedDocuments ?? [])
  const contractResult = validateContractSignatures(ctx, payload.contractSignatures ?? [])

  const errors = [...uploadResult.errors, ...contractResult.errors]

  const requiredContracts = getRequiredContractTypes(ctx)
  for (const contractType of requiredContracts) {
    const candidateSig = payload.contractSignatures?.find(
      s => s.contractType === contractType
    )
    const hrSig = hrCountersignatures.find(s => s.contractType === contractType)
    if (!candidateSig) {
      errors.push(`${contractType} is not signed by candidate`)
    } else {
      if (!candidateSig.signatureDataUrl) {
        errors.push(`Drawn signature required for ${contractType}`)
      }
      if (!hrSig?.hrCountersignedBy?.trim()) {
        errors.push(`HR countersign required for ${contractType}`)
      } else if (!hrSig.hrSignatureDataUrl) {
        errors.push(`HR signature pad required for ${contractType}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

export function groupUploadedDocuments(
  documents: PreEmploymentDocument[]
): Map<string, PreEmploymentDocument[]> {
  const groups = new Map<string, PreEmploymentDocument[]>()
  for (const doc of documents) {
    const list = groups.get(doc.type) ?? []
    list.push(doc)
    groups.set(doc.type, list)
  }
  return groups
}

export function groupRequirementsByCategory(
  requirements: DocumentRequirement[]
): Map<string, DocumentRequirement[]> {
  const groups = new Map<string, DocumentRequirement[]>()
  for (const req of requirements) {
    const list = groups.get(req.categoryLabel) ?? []
    list.push(req)
    groups.set(req.categoryLabel, list)
  }
  return groups
}

export { contractTypeFromDocumentType }
