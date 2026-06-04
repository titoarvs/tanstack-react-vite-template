import { ScrollText } from "lucide-react"
import { useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { AuditLogFilters } from "../components/AuditLogFilters"
import { AuditLogTable } from "../components/AuditLogTable"
import { useAuditLog } from "../hooks/useAuditLog"
import type { AuditCategoryFilter } from "../types"

export function AuditLogPage() {
  const [category, setCategory] = useState<AuditCategoryFilter>("all")
  const [search, setSearch] = useState("")
  const { entries, total } = useAuditLog({ category, search })

  return (
    <PageContent>
      <PageHeader title="Audit log" />
      <p className="-mt-4 mb-6 text-sm text-muted-foreground">
        Workspace activity trail. Select a row to open the full event record.
      </p>

      <AuditLogFilters
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        totalCount={total}
        filteredCount={entries.length}
      />

      <div className="mt-4">
        {entries.length === 0 ? (
          <Card className="border-dashed border-border/80">
            <CardContent className="py-16 text-center">
              <ScrollText className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-foreground">No events yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Move through the app — each page visit and action will appear in the table.
              </p>
            </CardContent>
          </Card>
        ) : (
          <AuditLogTable entries={entries} resetKey={`${category}-${search}`} />
        )}
      </div>
    </PageContent>
  )
}
