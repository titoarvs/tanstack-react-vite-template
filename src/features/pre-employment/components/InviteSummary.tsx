import type { PreEmploymentInvite } from "../types"
import { getPreEmploymentFullName } from "../types"
import { Card, CardContent } from "@/components/ui/card"

interface InviteSummaryProps {
  invite: PreEmploymentInvite
}

export function InviteSummary({ invite }: InviteSummaryProps) {
  return (
    <Card className="border-border/80 bg-muted/20">
      <CardContent className="grid gap-3 p-4 text-sm sm:grid-cols-2 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Candidate
          </p>
          <p className="mt-1 font-medium text-foreground">
            {getPreEmploymentFullName(invite)}
          </p>
          <p className="text-muted-foreground">{invite.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Intended role
          </p>
          <p className="mt-1 text-foreground">
            {invite.intendedPosition ?? "To be confirmed by HR"}
          </p>
          <p className="text-muted-foreground">
            {invite.intendedDepartment ?? "Department pending"}
            {invite.intendedHireDate ? ` · Start ${invite.intendedHireDate}` : ""}
          </p>
        </div>
        {invite.status === "rejected" && invite.rejectionNote && (
          <div className="sm:col-span-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive">
            <p className="text-xs font-semibold uppercase tracking-wider">HR feedback</p>
            <p className="mt-1 text-sm">{invite.rejectionNote}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
