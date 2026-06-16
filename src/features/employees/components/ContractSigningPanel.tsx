import { useState } from "react"
import { Input } from "@/components/ui/input"
import { getClientIpAddress } from "@/features/compliance/lib/clientIp"
import type { ContractType } from "@/features/employees/lib/documentRequirementPolicy"
import { isSignaturePadFilled } from "@/features/employees/lib/signaturePadUtils"
import { DocumentSignModal } from "@/features/employees/components/DocumentSignModal"
import type { ContractSignatureRecord } from "@/features/pre-employment/types"
import {
  CONTRACT_TITLES,
  CONTRACT_VERSIONS,
  getContractBody,
} from "@/features/pre-employment/lib/contractTemplates"
import type { PreEmploymentInvite } from "@/features/pre-employment/types"
import { getPreEmploymentLegalName } from "@/features/pre-employment/types"

interface ContractSigningPanelProps {
  contractType: ContractType
  invite: PreEmploymentInvite
  signature?: ContractSignatureRecord
  onSign: (record: ContractSignatureRecord) => void
}

export function ContractSigningPanel({
  contractType,
  invite,
  signature,
  onSign,
}: ContractSigningPanelProps) {
  const [typedName, setTypedName] = useState(signature?.signedName ?? "")
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    signature?.signatureDataUrl ?? null
  )
  const [error, setError] = useState<string | null>(null)
  const [signing, setSigning] = useState(false)

  const legalName = getPreEmploymentLegalName(invite)
  const contractBody = getContractBody(contractType, invite)

  const handleSign = async () => {
    setError(null)
    if (!isSignaturePadFilled(signatureDataUrl)) {
      setError("Draw your signature in the pad before signing")
      throw new Error("validation")
    }
    if (typedName.trim().toLowerCase() !== legalName.toLowerCase()) {
      setError(`Typed name must match your legal name: ${legalName}`)
      throw new Error("validation")
    }
    setSigning(true)
    try {
      const ipAddress = await getClientIpAddress()
      onSign({
        contractType,
        signedName: typedName.trim(),
        signedAt: new Date().toISOString(),
        documentVersion: CONTRACT_VERSIONS[contractType],
        ipAddress,
        signatureDataUrl: signatureDataUrl ?? undefined,
      })
    } finally {
      setSigning(false)
    }
  }

  return (
    <DocumentSignModal
      title={CONTRACT_TITLES[contractType]}
      description="Review the full document, then sign at the bottom of the modal."
      documentContent={contractBody}
      signed={Boolean(signature)}
      signedInfo={
        signature
          ? {
              signedBy: signature.signedName,
              signedAt: signature.signedAt,
              signatureDataUrl: signature.signatureDataUrl,
            }
          : undefined
      }
      signFields={
        <div>
          <label className="text-sm font-medium text-foreground">
            Type your full legal name
          </label>
          <Input
            value={typedName}
            onChange={e => setTypedName(e.target.value)}
            placeholder={legalName}
            className="mt-1"
          />
        </div>
      }
      signatureDataUrl={signatureDataUrl}
      onSignatureChange={setSignatureDataUrl}
      onSubmit={handleSign}
      submitting={signing}
      submitError={error}
      submitLabel="Apply signature"
    />
  )
}
