import { Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildJoinUrl } from "../api/preEmploymentApi"
import type { PreEmploymentInvite } from "../types"
import { getPreEmploymentFullName, getPreEmploymentStatusLabel } from "../types"

interface PreEmploymentInviteTableProps {
  invites: PreEmploymentInvite[]
  tab: "pending" | "review" | "approved"
}

function statusVariant(status: PreEmploymentInvite["status"]) {
  switch (status) {
    case "submitted":
      return "default" as const
    case "approved":
      return "secondary" as const
    case "rejected":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

export function PreEmploymentInviteTable({ invites, tab }: PreEmploymentInviteTableProps) {
  const filtered = invites.filter(invite => {
    if (tab === "pending") {
      return ["invited", "in_progress", "rejected"].includes(invite.status)
    }
    if (tab === "review") return invite.status === "submitted"
    return invite.status === "approved"
  })

  if (filtered.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No invites in this queue.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Invited</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(invite => (
            <tr key={invite.id} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{getPreEmploymentFullName(invite)}</p>
                <p className="text-xs text-muted-foreground">{invite.email}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {invite.intendedPosition ?? "—"}
                {invite.intendedDepartment ? ` · ${invite.intendedDepartment}` : ""}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant(invite.status)}>
                  {getPreEmploymentStatusLabel(invite.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(invite.invitedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                {invite.status === "submitted" ? (
                  <Button asChild size="sm">
                    <Link
                      to="/employees/pre-employment/$inviteId"
                      params={{ inviteId: invite.id }}
                    >
                      Review
                    </Link>
                  </Button>
                ) : invite.status === "approved" && invite.employeeRecordId ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      to="/employees/$employeeId"
                      params={{ employeeId: invite.employeeRecordId }}
                    >
                      View employee
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="ghost" size="sm">
                    <a href={buildJoinUrl(invite.token)} target="_blank" rel="noreferrer">
                      Open link
                    </a>
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
