import { recordOnboardingCompleted } from "@/features/audit/auditLogger"
import { employeeStore } from "@/lib/mock/employeeStore"
import { ForbiddenError, requireSessionUser } from "@/features/auth/authErrors"
import { needsEmployeeWelcomeOnboarding } from "../lib/profileOnboardingPolicy"
import type { ProfileOnboardingFormData } from "../schemas/profileOnboardingSchema"
import type { Employee, Gender } from "@/features/employees/types"

function toGender(value?: string): Gender | undefined {
  const allowed: Gender[] = ["male", "female", "other", "prefer-not-to-say"]
  return value && allowed.includes(value as Gender) ? (value as Gender) : undefined
}

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

  const updated = await employeeStore.updateProfile(user.employeeId, {
    contact: {
      phone: data.phone,
      address: data.address?.trim() || undefined,
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
    profileOnboardingComplete: true,
    profileOnboardingCompletedAt: now,
  })
  recordOnboardingCompleted(user.employeeId)
  return updated
}
