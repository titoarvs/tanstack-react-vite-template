/** Capability keys — extend as new screens/actions are added */
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  EMPLOYEES_VIEW_DIRECTORY: "employees.view_directory",
  EMPLOYEES_VIEW_OWN: "employees.view_own",
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_DELETE: "employees.delete",
  EMPLOYEES_PROFILE_PERSONAL: "employees.profile.personal",
  EMPLOYEES_PROFILE_EMPLOYMENT: "employees.profile.employment",
  /** @deprecated use EMPLOYEES_PROFILE_EMPLOYMENT */
  EMPLOYEES_PROFILE_JOB: "employees.profile.job",
  EMPLOYEES_PROFILE_COMPENSATION: "employees.profile.compensation",
  EMPLOYEES_PROFILE_GOVERNMENT: "employees.profile.government",
  EMPLOYEES_PROFILE_DOCUMENTS: "employees.profile.documents",
  EMPLOYEES_PROFILE_COMPLIANCE: "employees.profile.compliance",
  EMPLOYEES_PROFILE_ACCESS: "employees.profile.access",
  EMPLOYEES_PROFILE_TIME_OFF: "employees.profile.time_off",
  EMPLOYEES_PROFILE_PAY: "employees.profile.pay",
  EMPLOYEES_PROFILE_PERFORMANCE: "employees.profile.performance",
  EMPLOYEES_PROFILE_SELF_SERVICE: "employees.profile.self_service",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_THEME: "settings.theme",
  LEAVE_APPROVE: "leave.approve",
  USERS_MANAGE: "users.manage",
  RBAC_MANAGE: "rbac.manage",
  BILLING_MANAGE: "billing.manage",
  AUDIT_VIEW: "audit.view",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
