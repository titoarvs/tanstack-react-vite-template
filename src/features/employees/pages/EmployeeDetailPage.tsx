import { Link, useParams, useRouterState } from "@tanstack/react-router"
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
import { canViewEmployeeDirectory } from "@/features/auth/permissions"
import { useAuth } from "@/features/auth/useAuth"
import { PageContent } from "@/components/layout/PageContent"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { EmployeeJobTab } from "../components/detail/EmployeeJobTab"
import { EmployeePayInfoTab } from "../components/detail/EmployeePayInfoTab"
import { EmployeePerformanceTab } from "../components/detail/EmployeePerformanceTab"
import { EmployeePersonalTab } from "../components/detail/EmployeePersonalTab"
import type { ProfileTabValue } from "../components/detail/EmployeeProfileHeader"
import { EmployeeProfileHero } from "../components/detail/EmployeeProfileHero"
import { EmployeeProfileToolbar } from "../components/detail/EmployeeProfileToolbar"
import { ProfileAccessDenied } from "../components/detail/ProfileAccessDenied"
import { EmployeeTimeOffTab } from "../components/detail/EmployeeTimeOffTab"
import {
  countDirectReports,
  getEmployeeInsights,
} from "../data/mockEmployeeInsights"
import { fetchEmployeePayInsights } from "../api/employeeApi"
import { useEmployeeProfileNav } from "../hooks/useEmployeeProfileNav"
import { useEmployee, useEmployees } from "../hooks/useEmployees"
import { getFullName } from "../types"

const RESERVED_SEGMENTS = new Set(["directory", "onboarding"])

function useEmployeeIdFromRoute(): string | undefined {
  const params = useParams({ strict: false }) as { employeeId?: string }
  const pathname = useRouterState({ select: s => s.location.pathname })
  const segment = params.employeeId ?? pathname.split("/").pop()
  if (!segment || RESERVED_SEGMENTS.has(segment)) return undefined
  return segment
}

function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="h-48 rounded-xl bg-muted sm:h-56" />
      <div className="h-24 rounded-xl bg-muted" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
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

  const canViewPay = employee
    ? canViewProfileTab(user, employee.id, "pay-info", employee)
    : false
  const canViewPerformance = employee
    ? canViewProfileTab(user, employee.id, "performance", employee)
    : false

  let pay: ReturnType<typeof fetchEmployeePayInsights> | null = null
  let payError = false
  if (employee && canViewPay) {
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
  const insights = getEmployeeInsights(employee.id)
  const directReports = countDirectReports(employee.id, allEmployees ?? [])
  const showSelfService = canUseSelfService(user, employee.id)

  return (
    <PageContent className="bg-container">
      <div className="mx-auto min-w-0 max-w-6xl">
        <Tabs
          value={activeTab}
          onValueChange={v => setActiveTab(v as ProfileTabValue)}
          className="space-y-4 sm:space-y-6"
        >
          <EmployeeProfileHero
            employee={employee}
            manager={manager}
            backTo={backTo}
            backLabel={backLabel}
          />

          <EmployeeProfileToolbar
            employee={employee}
            nav={nav}
            visibleTabs={visibleTabs}
            showSelfService={showSelfService}
            showPayPeriod={canViewPay}
            periodEndLabel={pay?.periodEndLabel ?? "—"}
          />

          <div className="min-w-0 pb-8">
            <TabsContent value="personal" className="mt-0 outline-none">
              {canViewProfileTab(user, employee.id, "personal", employee) ? (
                <EmployeePersonalTab
                  personal={{
                    employeeId: employee.employeeId,
                    dateOfBirth: employee.demographics.dateOfBirth,
                    gender: employee.demographics.gender,
                    nationality: employee.demographics.nationality,
                    maritalStatus: employee.demographics.maritalStatus,
                    email: employee.contact.email,
                    phone: employee.contact.phone,
                    address: employee.contact.address,
                  }}
                />
              ) : (
                <ProfileAccessDenied />
              )}
            </TabsContent>

            <TabsContent value="job" className="mt-0 outline-none">
              {canViewProfileTab(user, employee.id, "job", employee) ? (
                <EmployeeJobTab
                  employment={{
                    department: employee.department,
                    position: employee.position,
                    managerName: manager ? getFullName(manager) : undefined,
                    officeBranch: employee.officeBranch,
                    hireDate: employee.lifecycle.hireDate,
                    probationEndDate: employee.lifecycle.probationEndDate,
                    contractStartDate: employee.lifecycle.contractStartDate,
                    contractEndDate: employee.lifecycle.contractEndDate,
                    status: employee.status,
                  }}
                />
              ) : (
                <ProfileAccessDenied />
              )}
            </TabsContent>

            <TabsContent value="time-off" className="mt-0 outline-none">
              {canViewProfileTab(user, employee.id, "time-off", employee) ? (
                <EmployeeTimeOffTab insights={insights} />
              ) : (
                <ProfileAccessDenied />
              )}
            </TabsContent>

            <TabsContent value="pay-info" className="mt-0 outline-none">
              {canViewPay && pay && !payError ? (
                <EmployeePayInfoTab pay={pay} />
              ) : (
                <ProfileAccessDenied
                  title="Pay information restricted"
                  description="Pay details are only available on your own profile, for your direct reports (managers), or with HR administrator access."
                />
              )}
            </TabsContent>

            <TabsContent value="performance" className="mt-0 outline-none">
              {canViewPerformance ? (
                <EmployeePerformanceTab
                  insights={insights}
                  directReports={directReports}
                />
              ) : (
                <ProfileAccessDenied
                  title="Performance restricted"
                  description="Performance details are only available on your own profile, for your direct reports (managers), or with HR administrator access."
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContent>
  )
}
