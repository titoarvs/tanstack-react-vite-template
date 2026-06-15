import type { AuthUser } from "./types"
import type { UserRole } from "./types"
import { getRoleLabel, ROLE_DESCRIPTIONS, ROLE_RANK } from "./roles"

export interface DemoAccount {
  email: string
  password: string
  user: AuthUser
}

/** Curated login picker — one entry per demo scenario (avoids duplicate role buttons). */
export interface DemoPickerEntry {
  id: string
  email: string
  password: string
  role: UserRole
  name: string
  label: string
  description: string
}

const DEMO_PASSWORD = "titohris"

const DEMO_ORG = {
  organizationId: "org-titohris",
  organizationName: "TitoHRIS Demo Co.",
} as const

function demoUser(
  id: string,
  email: string,
  name: string,
  role: UserRole,
  employeeId?: string
): AuthUser {
  return { id, email, name, role, employeeId, ...DEMO_ORG }
}

/** Known demo accounts — one per EDM role for testing RBAC */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "superadmin@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-superadmin",
      "superadmin@titohris.com",
      "Angeline Nathania",
      "hris_super_admin"
    ),
  },
  {
    email: "hr@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-hr",
      "hr@titohris.com",
      "Dorothy Chou",
      "hris_admin",
      "3"
    ),
  },
  {
    email: "hrbp@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-hrbp",
      "hrbp@titohris.com",
      "Carlos Mendoza",
      "hrbp",
      "3"
    ),
  },
  {
    email: "sysadmin@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-sysadmin",
      "sysadmin@titohris.com",
      "IT Systems Admin",
      "system_admin"
    ),
  },
  {
    email: "manager@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-manager",
      "manager@titohris.com",
      "Budi Santoso",
      "manager",
      "2"
    ),
  },
  {
    email: "employee@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-employee",
      "employee@titohris.com",
      "Angela Neyvitri Raharja",
      "employee",
      "1"
    ),
  },
  {
    email: "prehire@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-prehire",
      "prehire@titohris.com",
      "Rina Wijaya",
      "employee",
      "11"
    ),
  },
  /** Legacy alias — maps to HRIS SuperAdmin */
  {
    email: "admin@titohris.com",
    password: DEMO_PASSWORD,
    user: demoUser(
      "user-admin",
      "admin@titohris.com",
      "Angeline Nathania",
      "hris_super_admin"
    ),
  },
]

const PICKER_SCENARIO_OVERRIDES: Partial<
  Record<string, Pick<DemoPickerEntry, "label" | "description">>
> = {
  "prehire@titohris.com": {
    label: "Pre-hire",
    description:
      "Employee — privacy consent modal then welcome onboarding pending",
  },
}

export const DEMO_PICKER_ENTRIES: DemoPickerEntry[] = DEMO_ACCOUNTS.filter(
  account => account.email !== "admin@titohris.com"
)
  .map(account => {
    const override = PICKER_SCENARIO_OVERRIDES[account.email]
    const role = account.user.role

    return {
      id: account.user.id,
      email: account.email,
      password: account.password,
      role,
      name: account.user.name,
      label: override?.label ?? getRoleLabel(role),
      description:
        override?.description ??
        (account.email === "employee@titohris.com"
          ? "Standard employee self-service and own profile"
          : ROLE_DESCRIPTIONS[role]),
    }
  })
  .sort(
    (left, right) =>
      ROLE_RANK[right.role] - ROLE_RANK[left.role] ||
      left.label.localeCompare(right.label)
  )

/** Default account shown on login form */
export const DEMO_CREDENTIALS = {
  email: DEMO_ACCOUNTS[0].email,
  password: DEMO_PASSWORD,
} as const

export function findDemoAccount(
  email: string,
  password: string
): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase()
  const match = DEMO_ACCOUNTS.find(
    a => a.email === normalizedEmail && a.password === password
  )
  return match ? { ...match.user, email: normalizedEmail } : null
}

export function mockAdHocUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase()
  const localPart = normalizedEmail.split("@")[0] ?? "user"
  const name = localPart
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

  return {
    id: `user-adhoc-${normalizedEmail}`,
    email: normalizedEmail,
    name: name || "TitoHRIS User",
    role: "employee",
    ...DEMO_ORG,
  }
}
