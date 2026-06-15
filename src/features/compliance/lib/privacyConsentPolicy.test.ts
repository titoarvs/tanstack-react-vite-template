/**
 * Privacy consent policy tests.
 * Run: npx tsx src/features/compliance/lib/privacyConsentPolicy.test.ts
 */
import type { AuthUser } from "@/features/auth/types"
import { employeeStore } from "@/lib/mock/employeeStore"
import { getPostLoginPath } from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { needsPrivacyConsent } from "./privacyConsentPolicy"

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const employeeWithoutConsent: AuthUser = {
  id: "u-newhire",
  email: "newhire@titohris.com",
  role: "employee",
  employeeId: "11",
  name: "Rina Wijaya",
}

const employeeWithConsent: AuthUser = {
  id: "u-employee",
  email: "employee@titohris.com",
  role: "employee",
  employeeId: "1",
  name: "Angela",
}

const hrAdmin: AuthUser = {
  id: "u-hr",
  email: "hr@titohris.com",
  role: "hris_admin",
  name: "Dorothy",
}

assert(needsPrivacyConsent(employeeWithoutConsent) === true, "new hire needs privacy consent")
assert(needsPrivacyConsent(employeeWithConsent) === false, "established employee skips gate")
assert(needsPrivacyConsent(hrAdmin) === false, "HR admin never needs privacy consent")

assert(
  getPostLoginPath(employeeWithoutConsent) === "/privacy-consent",
  "post-login routes to privacy gate before welcome"
)

const onboardingEmployee = employeeStore.getByIdSync("11")
assert(onboardingEmployee != null, "seed employee 11 exists")
assert(
  onboardingEmployee.compliance?.privacyConsentSigned !== true,
  "seed onboarding employee has no privacy consent"
)

assert(
  getPostLoginPath(employeeWithConsent) === "/dashboard",
  "employee with consent goes to dashboard"
)

console.log("privacyConsentPolicy.test.ts — all assertions passed")
