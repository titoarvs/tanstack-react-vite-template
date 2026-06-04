import type { UserRole } from "@/features/auth/types"

export interface StaticModuleMeta {
  id: string
  title: string
  description: string
  roles: readonly UserRole[]
}

export const STATIC_MODULES: Record<string, StaticModuleMeta> = {
  "time-off": {
    id: "time-off",
    title: "Time off",
    description:
      "Request leave, view balances, and track approval status. This module is a Phase 2 preview with mock workflows only.",
    roles: ["employee", "manager", "hr_admin", "admin"],
  },
  attendance: {
    id: "attendance",
    title: "Attendance",
    description:
      "Daily time records, schedules, and attendance exceptions. Data shown on the dashboard is illustrative until backend integration.",
    roles: ["employee", "manager", "hr_admin", "admin"],
  },
  payslips: {
    id: "payslips",
    title: "Payslips",
    description:
      "Download payslips and view year-to-date earnings. Pay details on your employment profile remain the source of truth in Phase 1.",
    roles: ["employee"],
  },
  documents: {
    id: "documents",
    title: "Documents",
    description:
      "Personal HR documents, contracts, and policy acknowledgements. Upload and e-sign flows are not yet connected.",
    roles: ["employee"],
  },
  team: {
    id: "team",
    title: "My team",
    description:
      "Direct reports, team roster, and quick links to each member's employment profile. Scoped to your reporting line.",
    roles: ["manager", "hr_admin", "admin"],
  },
  "leave-approvals": {
    id: "leave-approvals",
    title: "Leave approvals",
    description:
      "Review and action leave requests from your direct reports. Pending items also surface on your dashboard.",
    roles: ["manager"],
  },
  leave: {
    id: "leave",
    title: "Leave management",
    description:
      "Organisation-wide leave policies, balances, and approvals for all employees. Manager queues remain on their own view.",
    roles: ["hr_admin", "admin"],
  },
  recruitment: {
    id: "recruitment",
    title: "Recruitment",
    description:
      "Open requisitions, candidates, and offer stages. Use employee onboarding today for new hires entering the directory.",
    roles: ["hr_admin", "admin"],
  },
  payroll: {
    id: "payroll",
    title: "Payroll",
    description:
      "Pay runs, statutory filings, and compensation exports. Pay info tabs on employee profiles are read-only mock data.",
    roles: ["hr_admin", "admin"],
  },
  reports: {
    id: "reports",
    title: "Reports & analytics",
    description:
      "Headcount, turnover, and workforce analytics beyond the dashboard charts. Export and scheduling arrive in a later phase.",
    roles: ["manager", "hr_admin", "admin"],
  },
  compliance: {
    id: "compliance",
    title: "Compliance",
    description:
      "Policy library, mandatory training, and audit checkpoints for people operations.",
    roles: ["hr_admin", "admin"],
  },
  inbox: {
    id: "inbox",
    title: "Inbox",
    description:
      "Notifications for leave, onboarding, and profile updates. Activity on the dashboard mirrors a subset of these events.",
    roles: ["employee", "manager", "hr_admin", "admin"],
  },
  help: {
    id: "help",
    title: "Help & support",
    description:
      "Guides for TitoHRIS, contact HR, and release notes. Demo accounts and role matrices are documented in the project readme.",
    roles: ["employee", "manager", "hr_admin", "admin"],
  },
  users: {
    id: "users",
    title: "Users & access",
    description:
      "Manage application users, roles, and invitations. Mock sign-in uses fixed demo accounts until an identity provider is wired.",
    roles: ["admin"],
  },
}

export function getStaticModule(moduleId: string): StaticModuleMeta | undefined {
  return STATIC_MODULES[moduleId]
}

export function canAccessStaticModule(
  moduleId: string,
  role: UserRole | undefined
): boolean {
  if (!role) return false
  const meta = STATIC_MODULES[moduleId]
  return meta != null && meta.roles.includes(role)
}
