import type { LucideIcon } from "lucide-react"
import {
  ClipboardCheck,
  LayoutDashboard,
  ScrollText,
  Settings,
  UserRound,
  Users,
} from "lucide-react"
import { PERMISSIONS, type Permission } from "@/features/auth/permissions"
import {
  HR_WRITE_ROLES_LIST,
  PRIVILEGED_ADMIN_ROLES,
} from "@/features/auth/roles"
import type { UserRole } from "@/features/auth/types"

export type SidebarNavItem = {
  id: string
  label: string
  icon: LucideIcon
  to: string
  permission?: Permission
  anyPermission?: readonly Permission[]
  /** If set, item is only shown for these roles (in addition to permission checks) */
  roles?: readonly UserRole[]
  /** Static Phase 2 module — links to /modules/:id */
  staticModuleId?: string
  isActive?: (pathname: string) => boolean
}

export type SidebarNavSection = {
  id: string
  /** Fixed title, or resolved in Sidebar from user role */
  title: string
  /** When set, employees see this title instead (e.g. My workspace) */
  titleForEmployee?: string
  items: SidebarNavItem[]
}

function modulePath(id: string) {
  return `/modules/${id}`
}

function moduleActive(id: string) {
  return (pathname: string) => pathname === modulePath(id)
}

export const sidebarSections: SidebarNavSection[] = [
  {
    id: "main",
    title: "Main Menu",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        to: "/dashboard",
        permission: PERMISSIONS.DASHBOARD_VIEW,
        isActive: pathname => pathname.startsWith("/dashboard"),
      },
      // {
      //   id: "inbox",
      //   label: "Inbox",
      //   icon: Inbox,
      //   to: modulePath("inbox"),
      //   staticModuleId: "inbox",
      //   roles: WORKSPACE_ROLES,
      //   isActive: moduleActive("inbox"),
      // },
    ],
  },
  {
    id: "workforce",
    title: "Workforce",
    titleForEmployee: "My workspace",
    items: [
      {
        id: "employees",
        label: "Employees",
        icon: Users,
        to: "/employees/directory",
        anyPermission: [
          PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY,
          PERMISSIONS.EMPLOYEES_VIEW_OWN,
        ],
        isActive: pathname =>
          pathname.startsWith("/employees") &&
          !pathname.includes("/onboarding") &&
          !pathname.includes("/pre-employment"),
      },
      {
        id: "pre-employment",
        label: "Pre-employment",
        icon: ClipboardCheck,
        to: "/employees/pre-employment",
        permission: PERMISSIONS.EMPLOYEES_CREATE,
        roles: HR_WRITE_ROLES_LIST,
        isActive: pathname => pathname.includes("/employees/pre-employment"),
      },
      // {
      //   id: "onboarding",
      //   label: "Express hire",
      //   icon: UserPlus,
      //   to: "/employees/onboarding",
      //   permission: PERMISSIONS.EMPLOYEES_CREATE,
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: pathname => pathname.includes("/employees/onboarding"),
      // },
      // {
      //   id: "team",
      //   label: "My team",
      //   icon: UsersRound,
      //   to: modulePath("team"),
      //   staticModuleId: "team",
      //   roles: ["manager", ...HR_OPS_ROLES],
      //   isActive: moduleActive("team"),
      // },
      // {
      //   id: "recruitment",
      //   label: "Recruitment",
      //   icon: Briefcase,
      //   to: modulePath("recruitment"),
      //   staticModuleId: "recruitment",
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: moduleActive("recruitment"),
      // },
    ],
  },
  {
    id: "time",
    title: "Time & attendance",
    items: [
      // {
      //   id: "time-off",
      //   label: "Time off",
      //   icon: Palmtree,
      //   to: modulePath("time-off"),
      //   staticModuleId: "time-off",
      //   roles: WORKSPACE_ROLES,
      //   isActive: moduleActive("time-off"),
      // },
      // {
      //   id: "attendance",
      //   label: "Attendance",
      //   icon: Clock,
      //   to: modulePath("attendance"),
      //   staticModuleId: "attendance",
      //   roles: WORKSPACE_ROLES,
      //   isActive: moduleActive("attendance"),
      // },
      // {
      //   id: "leave-approvals",
      //   label: "Leave approvals",
      //   icon: ClipboardCheck,
      //   to: modulePath("leave-approvals"),
      //   staticModuleId: "leave-approvals",
      //   roles: ["manager"],
      //   permission: PERMISSIONS.LEAVE_APPROVE,
      //   isActive: moduleActive("leave-approvals"),
      // },
      // {
      //   id: "leave-management",
      //   label: "Leave management",
      //   icon: CalendarClock,
      //   to: modulePath("leave"),
      //   staticModuleId: "leave",
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: moduleActive("leave"),
      // },
    ],
  },
  {
    id: "pay",
    title: "Pay & documents",
    titleForEmployee: "Pay & records",
    items: [
      // {
      //   id: "payslips",
      //   label: "Payslips",
      //   icon: Wallet,
      //   to: modulePath("payslips"),
      //   staticModuleId: "payslips",
      //   roles: ["employee"],
      //   isActive: moduleActive("payslips"),
      // },
      // {
      //   id: "payroll",
      //   label: "Payroll",
      //   icon: Wallet,
      //   to: modulePath("payroll"),
      //   staticModuleId: "payroll",
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: moduleActive("payroll"),
      // },
      // {
      //   id: "documents",
      //   label: "Documents",
      //   icon: FileText,
      //   to: modulePath("documents"),
      //   staticModuleId: "documents",
      //   roles: ["employee"],
      //   isActive: moduleActive("documents"),
      // },
      // {
      //   id: "reports",
      //   label: "Reports",
      //   icon: BarChart3,
      //   to: modulePath("reports"),
      //   staticModuleId: "reports",
      //   roles: ["manager", ...HR_OPS_ROLES],
      //   isActive: moduleActive("reports"),
      // },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    items: [
      // {
      //   id: "billing",
      //   label: "Billing",
      //   icon: CreditCard,
      //   to: "/billing",
      //   permission: PERMISSIONS.BILLING_MANAGE,
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: pathname => pathname.startsWith("/billing") || pathname.startsWith("/checkout"),
      // },
      // {
      //   id: "compliance",
      //   label: "Compliance",
      //   icon: Shield,
      //   to: modulePath("compliance"),
      //   staticModuleId: "compliance",
      //   roles: HR_WRITE_ROLES_LIST,
      //   isActive: moduleActive("compliance"),
      // },
      {
        id: "users",
        label: "Users & access",
        icon: UserRound,
        to: "/users-access",
        roles: ["hris_super_admin"],
        permission: PERMISSIONS.RBAC_MANAGE,
        isActive: pathname =>
          pathname === "/users-access" || pathname.startsWith("/modules/users"),
      },
      {
        id: "audit-log",
        label: "Audit log",
        icon: ScrollText,
        to: "/audit-log",
        permission: PERMISSIONS.AUDIT_VIEW,
        roles: PRIVILEGED_ADMIN_ROLES,
        isActive: pathname =>
          pathname === "/audit-log" || pathname.startsWith("/audit-log/"),
      },
    ],
  },
  {
    id: "support",
    title: "Support",
    items: [
      // {
      //   id: "help",
      //   label: "Help & support",
      //   icon: HelpCircle,
      //   to: modulePath("help"),
      //   staticModuleId: "help",
      //   roles: WORKSPACE_ROLES,
      //   isActive: moduleActive("help"),
      // },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        to: "/settings",
        anyPermission: [PERMISSIONS.SETTINGS_THEME, PERMISSIONS.SETTINGS_VIEW],
        isActive: pathname => pathname.startsWith("/settings"),
      },
    ],
  },
]

/** @deprecated Use sidebarSections — kept for imports that expect slice exports */
export const mainMenu = sidebarSections[0].items
export const orgMenu = sidebarSections[1].items
export const bottomMenu = sidebarSections[sidebarSections.length - 1].items
