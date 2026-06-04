export type { AuthUser, AuthSession, UserRole } from "./types"
export { USER_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, getRoleLabel, isUserRole } from "./roles"
export {
  PERMISSIONS,
  can,
  canAny,
  getPermissionsForRole,
  hasRole,
  hasAnyRole,
  canViewEmployeeDirectory,
  canAccessEmployeesModule,
} from "./permissions"
export type { Permission } from "./permissions"
export {
  canViewEmployeeRecord,
  canViewProfileTab,
  canUseSelfService,
  getVisibleProfileTabs,
  getDefaultProfileTab,
  filterEmployeesForUser,
  getEmployeeNavTarget,
  isSelf,
  isDirectReport,
} from "./accessPolicy"
export { ForbiddenError, requireSessionPermission, requireSessionUser } from "./authErrors"
export { DEMO_ACCOUNTS, DEMO_CREDENTIALS, findDemoAccount } from "./mockUsers"
export { AuthProvider } from "./AuthProvider"
export { useAuth } from "./useAuth"
export { RoleBadge } from "./components/RoleBadge"
export {
  requireAuth,
  requirePermission,
  redirectIfAuthenticated,
  requireEmployeeDirectory,
  requireEmployeeRecordAccess,
  requireEmployeesModule,
} from "./routeGuards"
