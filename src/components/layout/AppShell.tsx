import { Outlet, useRouterState } from "@tanstack/react-router"
import { useEffect } from "react"
import { MobileHeader } from "./MobileHeader"
import { Sidebar } from "./Sidebar"
import { AuditTrailListener } from "@/features/audit/components/AuditTrailListener"
import { SubscriptionBanner } from "@/features/billing/components/SubscriptionBanner"
import { SidebarProvider } from "./SidebarProvider"
import { useSidebar } from "./useSidebar"

function getMobileTitle(pathname: string) {
  if (pathname.match(/^\/audit-log\/[^/]+$/)) return "Audit event"
  if (pathname.startsWith("/audit-log")) return "Audit log"
  if (pathname.startsWith("/billing")) return "Billing"
  if (pathname.startsWith("/checkout")) return "Checkout"
  if (pathname.startsWith("/settings")) return "Settings"
  if (pathname.startsWith("/dashboard")) return "Dashboard"
  if (pathname.includes("/onboarding")) return "Onboard Employee"
  if (pathname.match(/\/employees\/[^/]+$/)) return "Employee Details"
  return "Employee"
}

function AppShellInner() {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const title = getMobileTitle(pathname)
  const { closeMobile } = useSidebar()

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  return (
    <div className="flex min-h-[100vh] w-full">
      <Sidebar id="app-sidebar" />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader title={title} />
        <AuditTrailListener />
        <SubscriptionBanner />
        <main className="flex min-h-0 min-w-0 max-h-[100vh] flex-1 flex-col overflow-x-clip overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AppShell() {
  return (
    <SidebarProvider>
      <AppShellInner />
    </SidebarProvider>
  )
}
