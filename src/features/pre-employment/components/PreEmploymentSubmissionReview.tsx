import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DocumentSignModal } from "@/features/employees/components/DocumentSignModal"
import { isSignaturePadFilled } from "@/features/employees/lib/signaturePadUtils"
import {
  buildRequirementContextFromInvite,
  getUploadRequirementsForPortal,
} from "@/features/employees/lib/documentRequirementPolicy"
import { DOCUMENT_TYPE_LABELS } from "@/features/employees/types/documents"
import { CONTRACT_TITLES, getContractBody } from "../lib/contractTemplates"
import type { ContractSignatureRecord, PreEmploymentInvite } from "../types"

interface PreEmploymentSubmissionReviewProps {
  invite: PreEmploymentInvite
}

export function PreEmploymentSubmissionReview({ invite }: PreEmploymentSubmissionReviewProps) {
  const payload = invite.candidatePayload
  const ctx = buildRequirementContextFromInvite(invite)
  const requirements = getUploadRequirementsForPortal(ctx)
  const uploads = payload.uploadedDocuments ?? []
  const signatures = payload.contractSignatures ?? []

  const uploadCountByType = (type: string) =>
    uploads.filter(u => u.type === type).length

  return (
    <div className="space-y-4">
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Document uploads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requirements.map(req => {
            const count = uploadCountByType(req.type)
            const satisfied = count >= req.minCount
            return (
              <div
                key={`${req.type}-${req.phase}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{req.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.categoryLabel}
                    {req.minCount > 1 ? ` · ${count}/${req.minCount}` : ""}
                  </p>
                </div>
                <Badge variant={satisfied ? "default" : "destructive"}>
                  {req.priority === "secondary"
                    ? count > 0
                      ? "Uploaded"
                      : "Optional"
                    : satisfied
                      ? "Complete"
                      : "Missing"}
                </Badge>
              </div>
            )
          })}
          {uploads.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {uploads.map(doc => (
                <li key={doc.id} className="flex flex-wrap items-center gap-2">
                  <span>
                    {DOCUMENT_TYPE_LABELS[doc.type]} — {doc.fileName}
                  </span>
                  {doc.dataUrl && (
                    <Button type="button" variant="link" size="sm" className="h-auto p-0" asChild>
                      <a href={doc.dataUrl} target="_blank" rel="noopener noreferrer">
                        View file
                      </a>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Contract signatures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {signatures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contracts signed.</p>
          ) : (
            signatures.map(sig => (
              <div
                key={sig.contractType}
                className="rounded-lg border border-border/60 px-3 py-2 text-sm"
              >
                <p className="font-medium">{CONTRACT_TITLES[sig.contractType]}</p>
                <p className="text-muted-foreground">
                  Signed by {sig.signedName} · {new Date(sig.signedAt).toLocaleString()}
                </p>
                {sig.ipAddress && (
                  <p className="text-xs text-muted-foreground">IP: {sig.ipAddress}</p>
                )}
                {sig.signatureDataUrl && (
                  <img
                    src={sig.signatureDataUrl}
                    alt={`Candidate signature for ${CONTRACT_TITLES[sig.contractType]}`}
                    className="mt-2 max-h-12 rounded border border-border/60 bg-card p-1"
                  />
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface HrContractCountersignProps {
  invite: PreEmploymentInvite
  countersignatures: ContractSignatureRecord[]
  onChange: (signatures: ContractSignatureRecord[]) => void
}

export function HrContractCountersignPanel({
  invite,
  countersignatures,
  onChange,
}: HrContractCountersignProps) {
  const signatures = invite.candidatePayload.contractSignatures ?? []
  const [drafts, setDrafts] = useState<
    Record<string, { hrName: string; signatureDataUrl: string | null }>
  >({})

  const getDraft = (contractType: ContractSignatureRecord["contractType"]) =>
    drafts[contractType] ?? { hrName: "", signatureDataUrl: null }

  const setDraft = (
    contractType: ContractSignatureRecord["contractType"],
    patch: Partial<{ hrName: string; signatureDataUrl: string | null }>
  ) => {
    setDrafts(prev => ({
      ...prev,
      [contractType]: { ...getDraft(contractType), ...patch },
    }))
  }

  const applyCountersign = (contractType: ContractSignatureRecord["contractType"]) => {
    const candidate = signatures.find(s => s.contractType === contractType)
    const draft = getDraft(contractType)
    if (!candidate || !draft.hrName.trim() || !isSignaturePadFilled(draft.signatureDataUrl)) {
      throw new Error("validation")
    }
    const existing = countersignatures.filter(s => s.contractType !== contractType)
    existing.push({
      ...candidate,
      hrCountersignedBy: draft.hrName.trim(),
      hrCountersignedAt: new Date().toISOString(),
      hrSignatureDataUrl: draft.signatureDataUrl ?? undefined,
    })
    onChange(existing)
  }

  const candidateSignatureFooter = (sig: ContractSignatureRecord) => (
    <div className="text-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        Candidate signature on file
      </p>
      <p className="mt-1 text-foreground">
        {sig.signedName} · {new Date(sig.signedAt).toLocaleString()}
      </p>
      {sig.signatureDataUrl && (
        <div className="mt-3 flex flex-col items-center gap-2">
          <img
            src={sig.signatureDataUrl}
            alt="Candidate signature"
            className="max-h-16 w-full max-w-xs object-contain"
          />
        </div>
      )}
    </div>
  )

  if (signatures.length === 0) return null

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base">HR countersign</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {signatures.map(sig => {
          const hrSig = countersignatures.find(s => s.contractType === sig.contractType)
          const draft = getDraft(sig.contractType)
          const isComplete = Boolean(hrSig?.hrCountersignedAt)

          return (
            <DocumentSignModal
              key={sig.contractType}
              title={CONTRACT_TITLES[sig.contractType]}
              description="Review the contract and candidate signature, then countersign at the bottom."
              documentContent={getContractBody(sig.contractType, invite)}
              signed={isComplete}
              signedInfo={
                isComplete
                  ? {
                      signedBy: hrSig?.hrCountersignedBy,
                      signedAt: hrSig?.hrCountersignedAt,
                      signatureDataUrl: hrSig?.hrSignatureDataUrl,
                    }
                  : undefined
              }
              readOnlyFooter={candidateSignatureFooter(sig)}
              signFields={
                !isComplete ? (
                  <Input
                    placeholder="HR representative full name"
                    value={draft.hrName}
                    onChange={e => setDraft(sig.contractType, { hrName: e.target.value })}
                  />
                ) : undefined
              }
              signatureDataUrl={isComplete ? undefined : draft.signatureDataUrl}
              onSignatureChange={
                isComplete ? undefined : url => setDraft(sig.contractType, { signatureDataUrl: url })
              }
              onSubmit={isComplete ? undefined : () => applyCountersign(sig.contractType)}
              submitLabel="Apply countersignature"
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
