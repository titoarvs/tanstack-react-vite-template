import { Link, useParams } from "@tanstack/react-router"
import { Construction } from "lucide-react"
import { PageContent } from "@/components/layout/PageContent"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getStaticModule } from "../staticModules"

export function StaticModulePage() {
  const { moduleId } = useParams({ strict: false }) as { moduleId?: string }
  const meta = moduleId ? getStaticModule(moduleId) : undefined

  if (!meta) {
    return (
      <PageContent>
        <p className="text-sm text-muted-foreground">Module not found.</p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Card className="border-dashed border-border/80">
        <CardContent className="flex flex-col items-start gap-4 py-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Construction className="h-3.5 w-3.5" />
            Coming soon
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{meta.title}</h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {meta.description}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/dashboard">Return to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </PageContent>
  )
}
