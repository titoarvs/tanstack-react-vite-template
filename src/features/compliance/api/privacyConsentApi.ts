import { recordPrivacyConsent as recordPrivacyConsentAudit } from "@/features/audit/auditLogger"
import { ForbiddenError, requireSessionUser } from "@/features/auth/authErrors"
import { employeeStore } from "@/lib/mock/employeeStore"
import type { Employee } from "@/features/employees/types"
import { PRIVACY_NOTICE_VERSION } from "../privacyNotice"
import { getClientIpAddress } from "../lib/clientIp"
import { needsPrivacyConsent } from "../lib/privacyConsentPolicy"

export async function recordPrivacyConsent(): Promise<Employee> {
  const user = requireSessionUser()
  if (user.role !== "employee" || !user.employeeId) {
    throw new ForbiddenError("Only employees can record privacy consent.")
  }
  if (!needsPrivacyConsent(user)) {
    throw new ForbiddenError("Privacy consent is already on record.")
  }

  const existing = employeeStore.getByIdSync(user.employeeId)
  if (!existing) {
    throw new ForbiddenError("No employee record linked to your account.")
  }

  const now = new Date().toISOString()
  const ipAddress = await getClientIpAddress()

  const updated = await employeeStore.updateEmployee(
    user.employeeId,
    {
      compliance: {
        ...existing.compliance,
        privacyConsentSigned: true,
        privacyConsentAt: now,
        privacyConsentDate: now.slice(0, 10),
        privacyConsentIpAddress: ipAddress,
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      },
    },
    user.email
  )

  recordPrivacyConsentAudit(user.employeeId, {
    version: PRIVACY_NOTICE_VERSION,
    ipAddress,
  })

  return updated
}
