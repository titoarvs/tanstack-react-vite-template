import { RootRoute, Route } from "@tanstack/react-router"
import { PERMISSIONS } from "../features/auth/permissions"
import {
  redirectIfAuthenticated,
  requireAuth,
  requireEmployeeDirectory,
  requireEmployeeRecordAccess,
  requirePermission,
} from "../features/auth/routeGuards"
import { LoginPage } from "../features/auth/pages/LoginPage"
import { AppShell } from "../components/layout/AppShell"
import { DashboardPage } from "../features/dashboard/pages/DashboardPage"
import { EmployeeDetailPage } from "../features/employees/pages/EmployeeDetailPage"
import { EmployeeDirectoryPage } from "../features/employees/pages/EmployeeDirectoryPage"
import { LandingPage } from "../features/marketing/pages/LandingPage"
import { WelcomeOnboardingPage } from "../features/employee-welcome/pages/WelcomeOnboardingPage"
import { requireWelcomeOnboardingAccess } from "../features/employee-welcome/routeGuards"
import { JoinPortalPage } from "../features/pre-employment/pages/JoinPortalPage"
import { JoinSubmittedPage } from "../features/pre-employment/pages/JoinSubmittedPage"
import {
  requireJoinPortalAccess,
  requireJoinSubmittedAccess,
} from "../features/pre-employment/routeGuards"
import { PreEmploymentHubPage } from "../features/pre-employment/pages/PreEmploymentHubPage"
import { PreEmploymentReviewPage } from "../features/pre-employment/pages/PreEmploymentReviewPage"
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage"
import { StaticModulePage } from "../features/placeholders/pages/StaticModulePage"
import { UsersAccessPage } from "../features/users-access/pages/UsersAccessPage"
import { SettingsPage } from "../features/settings/pages/SettingsPage"
import {
  requireActiveSubscription,
  requireAuditLogAccess,
  requireRbacManage,
  requireStaticModule,
} from "../features/auth/routeGuards"
import { AuditLogDetailPage } from "../features/audit/pages/AuditLogDetailPage"
import { AuditLogPage } from "../features/audit/pages/AuditLogPage"
import { PricingPage } from "../features/billing/pages/PricingPage"
import { CheckoutPage } from "../features/billing/pages/CheckoutPage"
import { BillingPage } from "../features/billing/pages/BillingPage"
import { EmployeesIndexRedirect } from "./employeesRedirect"
import { RootLayout } from "./rootLayout"

export const rootRoute = new RootRoute({
  component: RootLayout,
})

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
})

export const pricingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
})

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: redirectIfAuthenticated,
})

export const welcomeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: WelcomeOnboardingPage,
  beforeLoad: requireWelcomeOnboardingAccess,
})

export const joinRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/join/$token",
  component: JoinPortalPage,
  beforeLoad: requireJoinPortalAccess,
})

export const joinSubmittedRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/join/$token/submitted",
  component: JoinSubmittedPage,
  beforeLoad: requireJoinSubmittedAccess,
})

export const appLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppShell,
  beforeLoad: ({ location }) => {
    requireAuth({ location })
    requireActiveSubscription({ location })
  },
})

export const dashboardRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
  beforeLoad: requirePermission(PERMISSIONS.DASHBOARD_VIEW),
})

export const settingsRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/settings",
  component: SettingsPage,
})

export const auditLogRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/audit-log",
  beforeLoad: requireAuditLogAccess(),
})

export const auditLogIndexRoute = new Route({
  getParentRoute: () => auditLogRoute,
  path: "/",
  component: AuditLogPage,
})

export const auditLogDetailRoute = new Route({
  getParentRoute: () => auditLogRoute,
  path: "/$entryId",
  component: AuditLogDetailPage,
})

export const billingRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/billing",
  component: BillingPage,
})

export const checkoutRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search.plan === "string" ? search.plan : undefined,
    interval: typeof search.interval === "string" ? search.interval : undefined,
  }),
})

export const usersAccessRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/users-access",
  component: UsersAccessPage,
  beforeLoad: requireRbacManage(),
})

export const staticModuleRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/modules/$moduleId",
  component: StaticModulePage,
  beforeLoad: requireStaticModule,
})

export const employeesRoute = new Route({
  getParentRoute: () => appLayoutRoute,
  path: "/employees",
})

export const employeesIndexRoute = new Route({
  getParentRoute: () => employeesRoute,
  path: "/",
  component: EmployeesIndexRedirect,
})

export const directoryRoute = new Route({
  getParentRoute: () => employeesRoute,
  path: "/directory",
  component: EmployeeDirectoryPage,
  beforeLoad: requireEmployeeDirectory(),
})

export const onboardingRoute = new Route({
  getParentRoute: () => employeesRoute,
  path: "/onboarding",
  component: OnboardingPage,
  beforeLoad: requirePermission(PERMISSIONS.EMPLOYEES_CREATE),
})

export const preEmploymentRoute = new Route({
  getParentRoute: () => employeesRoute,
  path: "/pre-employment",
})

export const preEmploymentIndexRoute = new Route({
  getParentRoute: () => preEmploymentRoute,
  path: "/",
  component: PreEmploymentHubPage,
  beforeLoad: requirePermission(PERMISSIONS.EMPLOYEES_CREATE),
})

export const preEmploymentReviewRoute = new Route({
  getParentRoute: () => preEmploymentRoute,
  path: "/$inviteId",
  component: PreEmploymentReviewPage,
  beforeLoad: requirePermission(PERMISSIONS.EMPLOYEES_CREATE),
})

export const employeeDetailRoute = new Route({
  getParentRoute: () => employeesRoute,
  path: "/$employeeId",
  component: EmployeeDetailPage,
  beforeLoad: requireEmployeeRecordAccess,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  loginRoute,
  welcomeRoute,
  joinRoute,
  joinSubmittedRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    settingsRoute,
    auditLogRoute.addChildren([auditLogIndexRoute, auditLogDetailRoute]),
    billingRoute,
    checkoutRoute,
    usersAccessRoute,
    staticModuleRoute,
    employeesRoute.addChildren([
      employeesIndexRoute,
      directoryRoute,
      onboardingRoute,
      preEmploymentRoute.addChildren([
        preEmploymentIndexRoute,
        preEmploymentReviewRoute,
      ]),
      employeeDetailRoute,
    ]),
  ]),
])
