import { Link } from "@tanstack/react-router"
import { ArrowRight, Briefcase, CalendarDays, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PendingLeaveRequest } from "../data/mockDashboardData"

interface PendingActionsPanelProps {
  variant: "manager" | "hr"
  pendingLeave: PendingLeaveRequest[]
  openPositions: number
  onboardingInProgress: number
}

export function PendingActionsPanel({
  variant,
  pendingLeave,
  openPositions,
  onboardingInProgress,
}: PendingActionsPanelProps) {
  const isHr = variant === "hr"

  return (
    <div className="space-y-4">
      <Card className="border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            {isHr ? "Pending leave" : "Team leave requests"}
          </CardTitle>
          <Badge variant="secondary">{pendingLeave.length}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingLeave.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
              {isHr ? "No pending leave requests." : "No pending requests from your team."}
            </p>
          ) : (
            pendingLeave.map(request => (
              <div
                key={request.id}
                className="rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <p className="text-sm font-medium">{request.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  {request.leaveType} · {request.dates}
                </p>
              </div>
            ))
          )}
          <Button variant="ghost" size="sm" className="w-full text-primary" disabled>
            Review all requests
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            Quick actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {isHr && (
            <Button variant="outline" asChild className="justify-start">
              <Link to="/employees/pre-employment">
                <ClipboardCheck className="h-4 w-4" />
                Pre-employment queue
                {onboardingInProgress > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {onboardingInProgress} need attention
                  </Badge>
                )}
              </Link>
            </Button>
          )}
          {isHr && (
            <Button variant="outline" asChild className="justify-start">
              <Link to="/employees/onboarding">
                <ClipboardCheck className="h-4 w-4" />
                Express hire
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild className="justify-start">
            <Link to="/employees/directory">
              <CalendarDays className="h-4 w-4" />
              {isHr ? "View directory" : "Employee directory"}
            </Link>
          </Button>
          {isHr && (
            <Button variant="outline" disabled className="justify-start">
              <Briefcase className="h-4 w-4" />
              Open roles
              <Badge variant="secondary" className="ml-auto">
                {openPositions}
              </Badge>
            </Button>
          )}
          {!isHr && (
            <Button variant="outline" disabled className="justify-start">
              <Briefcase className="h-4 w-4" />
              Approve leave
              <span className="ml-auto text-xs text-muted-foreground">Soon</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
