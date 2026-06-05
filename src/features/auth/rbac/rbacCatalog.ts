import { PERMISSIONS, type Permission } from "../permissionKeys"

export interface PermissionDefinition {
  key: Permission
  label: string
  description: string
}

export interface PermissionGroup {
  id: string
  label: string
  description?: string
  permissions: PermissionDefinition[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    permissions: [
      {
        key: PERMISSIONS.DASHBOARD_VIEW,
        label: "View dashboard",
        description: "Access the home dashboard and summary widgets.",
      },
      {
        key: PERMISSIONS.SETTINGS_VIEW,
        label: "HR workspace settings",
        description: "View organisation and workspace settings beyond appearance.",
      },
      {
        key: PERMISSIONS.SETTINGS_THEME,
        label: "Appearance settings",
        description: "Change theme and personal UI preferences.",
      },
    ],
  },
  {
    id: "employees",
    label: "Employees",
    permissions: [
      {
        key: PERMISSIONS.EMPLOYEES_VIEW_DIRECTORY,
        label: "View employee directory",
        description: "Browse the full employee list.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_VIEW_OWN,
        label: "View own employment record",
        description: "Open the signed-in user's linked employee profile.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_CREATE,
        label: "Create employees",
        description: "Express hire, onboarding, and pre-employment workflows.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_DELETE,
        label: "Delete employees",
        description: "Remove employee records from the directory.",
      },
    ],
  },
  {
    id: "profile-tabs",
    label: "Profile tabs",
    description: "Controls which EDM tabs appear when viewing employee records.",
    permissions: [
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_PERSONAL,
        label: "Personal",
        description: "Personal and contact information.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_EMPLOYMENT,
        label: "Employment",
        description: "Job, department, and reporting details.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_COMPENSATION,
        label: "Compensation",
        description: "Salary and compensation fields.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_GOVERNMENT,
        label: "Government IDs",
        description: "Tax and statutory identifiers.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_DOCUMENTS,
        label: "Documents",
        description: "HR document repository on profiles.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_COMPLIANCE,
        label: "Compliance",
        description: "Policy and compliance checkpoints.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_ACCESS,
        label: "Access",
        description: "Portal access and role assignment fields.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_TIME_OFF,
        label: "Time off",
        description: "Leave balances and requests on profiles.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_PAY,
        label: "Pay (sensitive)",
        description: "Payroll and pay-related sensitive data.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_PERFORMANCE,
        label: "Performance (sensitive)",
        description: "Performance review and rating data.",
      },
      {
        key: PERMISSIONS.EMPLOYEES_PROFILE_SELF_SERVICE,
        label: "Self-service requests",
        description: "Submit personal data change requests.",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    permissions: [
      {
        key: PERMISSIONS.LEAVE_APPROVE,
        label: "Approve leave",
        description: "Action leave requests for direct reports.",
      },
      {
        key: PERMISSIONS.BILLING_MANAGE,
        label: "Manage billing",
        description: "Subscription, seats, and checkout flows.",
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    description: "Restricted capabilities — HRIS Super Admin retains RBAC management.",
    permissions: [
      {
        key: PERMISSIONS.USERS_MANAGE,
        label: "Manage application users",
        description: "Invite and deactivate portal users.",
      },
      {
        key: PERMISSIONS.RBAC_MANAGE,
        label: "Manage role permissions",
        description: "Configure RBAC for each application role.",
      },
      {
        key: PERMISSIONS.AUDIT_VIEW,
        label: "View audit log",
        description: "Enterprise audit trail and activity history.",
      },
    ],
  },
]

export const ALL_CATALOG_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap(group =>
  group.permissions.map(permission => permission.key)
)
