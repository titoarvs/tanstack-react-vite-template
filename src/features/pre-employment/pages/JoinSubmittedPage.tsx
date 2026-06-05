import { Link, useParams } from "@tanstack/react-router"
import { Clock, Mail } from "lucide-react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePreEmploymentByToken } from "../hooks/usePreEmployment"
import { getPreEmploymentFullName } from "../types"

export function JoinSubmittedPage() {
  const { token } = useParams({ strict: false }) as { token: string }
  const { data: invite, isLoading } = usePreEmploymentByToken(token ?? "")

  if (isLoading || !invite) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4 sm:px-6">
          <Link to="/">
            <TitoLogo size="md" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="space-y-4 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Clock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Submitted for HR review</h1>
            <p className="text-sm text-muted-foreground">
              Thanks, {getPreEmploymentFullName(invite)}. HR is reviewing your pre-employment
              forms. You will receive an email with login instructions once approved — you cannot
              access the HRIS workspace until then.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-4 w-4" />
              {invite.email}
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/">Return to home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
