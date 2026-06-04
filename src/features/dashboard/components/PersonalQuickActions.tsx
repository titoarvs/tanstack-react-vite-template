import { Link } from "@tanstack/react-router"
import { ArrowRight, CalendarDays, FileText } from "lucide-react"
import { getEmployeeNavTarget } from "@/features/auth/accessPolicy"
import type { AuthUser } from "@/features/auth/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PersonalQuickActionsProps {
  user: AuthUser
}

export function PersonalQuickActions({ user }: PersonalQuickActionsProps) {
  const profileTo = getEmployeeNavTarget(user)

  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Quick actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button variant="outline" asChild className="justify-start">
          <Link to={profileTo}>
            <FileText className="h-4 w-4" />
            View my employment
            <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="justify-start">
          <Link to={profileTo}>
            <CalendarDays className="h-4 w-4" />
            Time off & balances
          </Link>
        </Button>
        <Button variant="outline" disabled className="justify-start">
          Request leave
          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
        </Button>
      </CardContent>
    </Card>
  )
}
