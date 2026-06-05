import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateInviteForm } from "../components/CreateInviteForm"
import { PreEmploymentInviteTable } from "../components/PreEmploymentInviteTable"
import { usePreEmploymentInvites } from "../hooks/usePreEmployment"

export function PreEmploymentHubPage() {
  const { data: invites = [], isLoading } = usePreEmploymentInvites()
  const [tab, setTab] = useState<"pending" | "review" | "approved">("review")

  const reviewCount = invites.filter(i => i.status === "submitted").length

  return (
    <PageContent className="bg-container">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/employees/directory"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          People directory
        </Link>

        <PageHeader title="Pre-employment" />

        <p className="-mt-4 mb-6 max-w-2xl text-sm text-muted-foreground">
          Invite candidates to complete onboarding before they receive an employee record or HRIS
          access.
        </p>

        <CreateInviteForm />

        <Tabs
          value={tab}
          onValueChange={v => setTab(v as typeof tab)}
          className="mt-8 space-y-4"
        >
          <TabsList>
            <TabsTrigger value="review">
              Awaiting review{reviewCount > 0 ? ` (${reviewCount})` : ""}
            </TabsTrigger>
            <TabsTrigger value="pending">Pending invites</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading invites…</p>
          ) : (
            <>
              <TabsContent value="review" className="mt-0">
                <PreEmploymentInviteTable invites={invites} tab="review" />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <PreEmploymentInviteTable invites={invites} tab="pending" />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <PreEmploymentInviteTable invites={invites} tab="approved" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </PageContent>
  )
}
