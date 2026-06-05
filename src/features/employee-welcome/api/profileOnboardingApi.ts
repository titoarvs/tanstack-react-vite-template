import { recordOnboardingCompleted } from "@/features/audit/auditLogger"
import { employeeStore } from "@/lib/mock/employeeStore"
import { ForbiddenError, requireSessionUser } from "@/features/auth/authErrors"
import { needsEmployeeWelcomeOnboarding } from "../lib/profileOnboardingPolicy"
import type { ProfileOnboardingFormData } from "../schemas/profileOnboardingSchema"
import { toGender } from "@/features/employees/lib/normalizeEmployee"
import type { Employee } from "@/features/employees/types"

export async function completeProfileOnboarding(
  data: ProfileOnboardingFormData
): Promise<Employee> {
  const user = requireSessionUser()
  if (!user.employeeId) {
    throw new ForbiddenError("No employee record linked to your account.")
  }
  if (!needsEmployeeWelcomeOnboarding(user)) {
    throw new ForbiddenError("Profile onboarding is already complete.")
  }

  const now = new Date().toISOString()
  const emergency =
    data.emergencyContactName?.trim() ||
    data.emergencyContactPhone?.trim() ||
    data.emergencyContactRelationship?.trim()
      ? {
          name: data.emergencyContactName?.trim() || undefined,
          phone: data.emergencyContactPhone?.trim() || undefined,
          relationship: data.emergencyContactRelationship?.trim() || undefined,
        }
      : undefined

  const updated = await employeeStore.updateEmployee(
    user.employeeId,
    {
      contact: {
        phone: data.phone,
        address: data.address?.trim() || undefined,
        province: data.province?.trim() || undefined,
      },
      demographics: {
        dateOfBirth: data.dateOfBirth || undefined,
        gender: toGender(data.gender),
        nationality: data.nationality?.trim() || undefined,
        maritalStatus: data.maritalStatus?.trim() || undefined,
      },
      preferredName: data.preferredName?.trim() || undefined,
      personalEmail: data.personalEmail?.trim() || undefined,
      photoUrl: data.photoUrl || undefined,
      emergencyContact: emergency,
      compliance: {
        privacyConsentSigned: data.acknowledgePrivacy,
        privacyConsentDate: data.acknowledgePrivacy ? now.slice(0, 10) : undefined,
        dataSubjectAccessSigned: data.acknowledgePrivacy,
      },
      profileOnboardingComplete: true,
      profileOnboardingCompletedAt: now,
      status: "active",
    },
    user.email
  )
  recordOnboardingCompleted(user.employeeId)
  return updated
}
