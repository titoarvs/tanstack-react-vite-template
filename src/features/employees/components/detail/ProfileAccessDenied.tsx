import { ShieldOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileAccessDeniedProps {
  title?: string
  description?: string
}

export function ProfileAccessDenied({
  title = "Access restricted",
  description = "You do not have permission to view this section for this employee.",
}: ProfileAccessDeniedProps) {
  return (
    <Card className="border-dashed border-border/80 shadow-none">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ShieldOff className="h-6 w-6 text-muted-foreground" />
        </span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
