import { Button } from "@/components/ui/button"
import type { PreEmploymentFormData, PreEmploymentInvite } from "../types"
import { getPreEmploymentFullName } from "../types"

interface PreEmploymentReviewStepProps {
  invite: PreEmploymentInvite
  data: PreEmploymentFormData
  onEditStep: (step: number) => void
}

export function PreEmploymentReviewStep({
  invite,
  data,
  onEditStep,
}: PreEmploymentReviewStepProps) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Name", value: getPreEmploymentFullName(invite), step: 0 },
    { label: "Work email", value: invite.email, step: 0 },
    { label: "Phone", value: data.phone, step: 0 },
    { label: "Address", value: [data.address, data.province].filter(Boolean).join(", ") || "—", step: 0 },
    {
      label: "Emergency contact",
      value: data.emergencyContactName
        ? `${data.emergencyContactName} (${data.emergencyContactRelationship ?? "—"})`
        : "—",
      step: 1,
    },
    {
      label: "Policies",
      value:
        data.acknowledgeHandbook && data.acknowledgePrivacy
          ? "Handbook & privacy acknowledged"
          : "Incomplete",
      step: 2,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Review your submission</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          HR will review these details before creating your employee record and portal access.
        </p>
      </div>
      <dl className="divide-y divide-border rounded-xl border border-border/80">
        {rows.map(row => (
          <div
            key={row.label}
            className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{row.value}</dd>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onEditStep(row.step)}>
              Edit
            </Button>
          </div>
        ))}
      </dl>
    </div>
  )
}
