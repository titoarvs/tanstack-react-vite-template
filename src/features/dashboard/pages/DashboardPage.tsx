import { PageContent } from "@/components/layout/PageContent"
import { useAuth } from "@/features/auth/useAuth"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardWelcomeBanner } from "../components/DashboardWelcomeBanner"
import { EmployeeDashboardView } from "../components/EmployeeDashboardView"
import { HrDashboardView } from "../components/HrDashboardView"
import { ManagerDashboardView } from "../components/ManagerDashboardView"
import { useDashboardData } from "../hooks/useDashboardData"
import { isHrDashboardRole } from "../lib/dashboardScope"

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 w-full rounded-xl bg-muted" />
      <div className="h-16 w-full max-w-md rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-xl bg-muted lg:col-span-2" />
        <div className="h-72 rounded-xl bg-muted" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user, can } = useAuth()
  const data = useDashboardData()
  const { variant, isLoading, isError, teamReports, metrics, selfEmployee } =
    data

  const orgCount = isHrDashboardRole(variant)
    ? metrics.totalEmployees
    : undefined

  return (
    <PageContent>
      <DashboardWelcomeBanner
        user={user}
        variant={variant}
        teamCount={variant === "manager" ? teamReports.length : undefined}
        orgCount={orgCount}
        selfEmployee={selfEmployee}
      />
      <DashboardHeader user={user} variant={variant} can={can} />

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <p className="text-sm text-destructive">
          Could not load dashboard metrics. Please refresh.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {variant === "employee" && <EmployeeDashboardView data={data} />}
          {variant === "manager" && <ManagerDashboardView data={data} />}
          {isHrDashboardRole(variant) && <HrDashboardView data={data} />}
        </>
      )}
    </PageContent>
  )
}
