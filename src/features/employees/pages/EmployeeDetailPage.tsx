import { Link, useParams, useRouterState } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { recordEmployeeViewed } from "@/features/audit/auditLogger"
import {
  canUseSelfService,
  canViewEmployeeRecord,
  canViewProfileTab,
  filterEmployeesForUser,
  getDefaultProfileTab,
  getVisibleProfileTabs,
} from "@/features/auth/accessPolicy"
import { canViewPayrollHistory } from "@/features/employees/edm/fieldPolicy"
import { canViewEmployeeDirectory } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { PageContent } from "@/components/layout/PageContent"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { EdmAccessTab } from "../components/detail/edm/EdmAccessTab"
import { EdmCompensationTab } from "../components/detail/edm/EdmCompensationTab"
import { EdmComplianceTab } from "../components/detail/edm/EdmComplianceTab"
import { EdmDocumentsTab } from "../components/detail/edm/EdmDocumentsTab"
import { EdmEmploymentTab } from "../components/detail/edm/EdmEmploymentTab"
import { EdmGovernmentTab } from "../components/detail/edm/EdmGovernmentTab"
import { EdmPersonalTab } from "../components/detail/edm/EdmPersonalTab"
import type { ProfileTabValue } from "../components/detail/EmployeeProfileHeader"
import { EmployeeProfileSidePanel } from "../components/detail/EmployeeProfileSidePanel"
import { EmployeeProfileToolbar } from "../components/detail/EmployeeProfileToolbar"
import { ProfileAccessDenied } from "../components/detail/ProfileAccessDenied"
import { fetchEmployeePayInsights } from "../api/employeeApi"
import { useEmployeeProfileNav } from "../hooks/useEmployeeProfileNav"
import { useEmployee, useEmployees } from "../hooks/useEmployees"
import { getFullName } from "../types"

const RESERVED_SEGMENTS = new Set(["directory", "onboarding", "pre-employment"])

function useEmployeeIdFromRoute(): string | undefined {
  const params = useParams({ strict: false }) as { employeeId?: string }
  const pathname = useRouterState({ select: s => s.location.pathname })
  const segment = params.employeeId ?? pathname.split("/").pop()
  if (!segment || RESERVED_SEGMENTS.has(segment)) return undefined
  return segment
}

function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="mb-4 h-4 w-24 rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[minmax(17rem,20rem)_1fr]">
        <div className="h-[32rem] rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-24 rounded-xl bg-muted" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-64 rounded-xl bg-muted" />
            <div className="h-64 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmployeeDetailPage() {
  const { user } = useAuth()
  const employeeId = useEmployeeIdFromRoute()
  const { data: employee, isLoading, isError } = useEmployee(employeeId ?? "")
  const { data: allEmployees } = useEmployees()
  const visibleEmployees = useMemo(
    () => filterEmployeesForUser(user, allEmployees ?? []),
    [user, allEmployees]
  )
  const nav = useEmployeeProfileNav(employeeId ?? "", visibleEmployees)
  const showDirectoryBack = canViewEmployeeDirectory(user)
  const backTo = showDirectoryBack ? "/employees/directory" : "/dashboard"
  const backLabel = showDirectoryBack ? "People" : "Dashboard"

  const visibleTabs = useMemo(
    () =>
      employee
        ? getVisibleProfileTabs(user, employee.id, employee).map(t => ({
            value: t.value,
            label: t.label,
          }))
        : [],
    [user, employee]
  )

  const defaultTab = useMemo(
    () =>
      employee ? getDefaultProfileTab(user, employee.id, employee) : "personal",
    [user, employee]
  )

  const [activeTab, setActiveTab] = useState<ProfileTabValue>(defaultTab)
  const viewedEmployeeRef = useRef<string | null>(null)

  useEffect(() => {
    if (!employee) return
    if (viewedEmployeeRef.current === employee.id) return
    viewedEmployeeRef.current = employee.id
    recordEmployeeViewed(employee.id, getFullName(employee))
  }, [employee])

  useEffect(() => {
    if (!employee) return
    const allowed = visibleTabs.some(t => t.value === activeTab)
    if (!allowed) {
      setActiveTab(getDefaultProfileTab(user, employee.id, employee))
    }
  }, [employee, user, visibleTabs, activeTab])

  const canViewCompensation = employee
    ? canViewProfileTab(user, employee.id, "compensation", employee)
    : false
  const canViewPayroll = employee
    ? canViewPayrollHistory(user, employee.id, employee)
    : false

  let pay: ReturnType<typeof fetchEmployeePayInsights> | null = null
  let payError = false
  if (employee && canViewPayroll) {
    try {
      pay = fetchEmployeePayInsights(employee.id, employee)
    } catch {
      payError = true
    }
  }

  if (!employeeId) {
    return (
      <PageContent>
        <p className="text-destructive">Invalid employee route.</p>
        <Link to={backTo} className="mt-4 inline-block text-primary">
          Back to {backLabel.toLowerCase()}
        </Link>
      </PageContent>
    )
  }

  if (isLoading) {
    return (
      <PageContent className="bg-container">
        <DetailPageSkeleton />
      </PageContent>
    )
  }

  if (isError || !employee) {
    return (
      <PageContent>
        <p className="text-destructive">Employee not found.</p>
        <Link to={backTo} className="mt-4 inline-block text-primary">
          Back to {backLabel.toLowerCase()}
        </Link>
      </PageContent>
    )
  }

  if (!canViewEmployeeRecord(user, employee.id, employee)) {
    return (
      <PageContent>
        <ProfileAccessDenied
          title="Employment record restricted"
          description="You can only view your own employment details."
        />
        <Link to="/dashboard" className="mt-4 inline-block text-primary">
          Back to dashboard
        </Link>
      </PageContent>
    )
  }

  const manager = allEmployees?.find(e => e.id === employee.managerId)
  const showSelfService = canUseSelfService(user, employee.id)

  return (
    <PageContent className="bg-container flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-7xl flex-1 flex-col">
        <Link
          to={backTo}
          className="mb-4 inline-flex w-fit shrink-0 items-center gap-1 rounded-lg px-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(17rem,20rem)_1fr] lg:overflow-hidden">
          <EmployeeProfileSidePanel employee={employee} manager={manager} />

          <div className="scroll-area flex min-h-0 min-w-0 flex-col lg:overflow-y-auto lg:overscroll-contain">
            <Tabs
              value={activeTab}
              onValueChange={v => setActiveTab(v as ProfileTabValue)}
              className="space-y-4"
            >
              <EmployeeProfileToolbar
                employee={employee}
                nav={nav}
                visibleTabs={visibleTabs}
                showSelfService={showSelfService}
                showPayPeriod={canViewPayroll}
                periodEndLabel={pay?.periodEndLabel ?? "—"}
              />

              <div className="min-w-0 pb-8">
                <TabsContent value="personal" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "personal", employee) ? (
                    <EdmPersonalTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>

                <TabsContent value="employment" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "employment", employee) ? (
                    <EdmEmploymentTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>

                <TabsContent value="compensation" className="mt-0 outline-none">
                  {canViewCompensation ? (
                    <EdmCompensationTab
                      employee={employee}
                      pay={payError ? null : pay}
                      showPayrollHistory={canViewPayroll && !payError}
                    />
                  ) : (
                    <ProfileAccessDenied
                      title="Compensation restricted"
                      description="Compensation details are only available on your own profile or with HR administrator access."
                    />
                  )}
                </TabsContent>

                <TabsContent value="government" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "government", employee) ? (
                    <EdmGovernmentTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "documents", employee) ? (
                    <EdmDocumentsTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>

                <TabsContent value="compliance" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "compliance", employee) ? (
                    <EdmComplianceTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>

                <TabsContent value="access" className="mt-0 outline-none">
                  {canViewProfileTab(user, employee.id, "access", employee) ? (
                    <EdmAccessTab employee={employee} />
                  ) : (
                    <ProfileAccessDenied />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContent>
  )
}
