import {
  recordEmployeeCreated,
  recordPreEmploymentApproved,
  recordPreEmploymentInvited,
  recordPreEmploymentSubmitted,
} from "@/features/audit/auditLogger"
import { ForbiddenError, requireSessionUser } from "@/features/auth/authErrors"
import { PERMISSIONS } from "@/features/auth/permissions"
import { provisionPortalUser } from "@/features/auth/provisionedUserStorage"
import {
  isDemoOrganization,
  resolveOrganizationId,
  resolveOrganizationName,
} from "@/features/billing/organization"
import {
  ensureSubscriptionForOrg,
  getSubscription,
} from "@/features/billing/subscriptionStorage"
import {
  canAddSeat,
  hasSubscriptionFeature,
} from "@/features/billing/subscriptionPolicy"
import type { WorkLocation } from "@/features/employees/data/masterData"
import { toStoredAddress } from "@/features/employees/lib/address"
import { buildRequirementContextFromInvite } from "@/features/employees/lib/documentRequirementPolicy"
import {
  computeProbationEnd,
  computeRegularizationDate,
  deriveChecklistStatus,
  toGender,
} from "@/features/employees/lib/employeeCalculations"
import { resolveStatusForCreate } from "@/features/employees/lib/employmentStatus"
import type {
  CreateEmployeeInput,
  EmploymentType,
} from "@/features/employees/types"
import { employeeStore } from "@/lib/mock/employeeStore"
import { preEmploymentStore } from "@/lib/mock/preEmploymentStore"
import { requireSessionPermission } from "@/features/auth/authErrors"
import {
  mapPreEmploymentToEmployeeDocuments,
  validateInviteForApproval,
} from "../lib/preEmploymentDocuments"
import type {
  ApprovePreEmploymentInput,
  ApprovePreEmploymentResult,
  CreatePreEmploymentInviteInput,
  PreEmploymentFormData,
  PreEmploymentInvite,
} from "../types"

const MOCK_TEMP_PASSWORD_HINT =
  "Use any password with at least 4 characters (mock portal login)."

function getOrgSubscriptionForUser(
  user: ReturnType<typeof requireSessionUser>
) {
  const organizationId = resolveOrganizationId(user)
  const organizationName = resolveOrganizationName(user)
  return (
    getSubscription(organizationId) ??
    ensureSubscriptionForOrg(organizationId, organizationName, {
      demo: isDemoOrganization(organizationId),
    })
  )
}

export async function listPreEmploymentInvites(): Promise<
  PreEmploymentInvite[]
> {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  return preEmploymentStore.list()
}

export async function getPreEmploymentInvite(
  id: string
): Promise<PreEmploymentInvite> {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  const invite = await preEmploymentStore.getById(id)
  if (!invite) throw new Error("Invite not found")
  return invite
}

export async function getPreEmploymentInviteByToken(
  token: string
): Promise<PreEmploymentInvite> {
  const invite = await preEmploymentStore.getByToken(token)
  if (!invite) throw new Error("Invalid or expired invite link")
  if (invite.status === "cancelled" || invite.status === "expired") {
    throw new ForbiddenError("This invite is no longer active")
  }
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
    throw new ForbiddenError("This invite has expired")
  }
  return invite
}

export async function createPreEmploymentInvite(
  input: CreatePreEmploymentInviteInput
): Promise<PreEmploymentInvite> {
  const user = requireSessionUser()
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  const subscription = getOrgSubscriptionForUser(user)
  if (!hasSubscriptionFeature(subscription, "employee_onboarding")) {
    throw new ForbiddenError(
      "Your plan does not include employee onboarding. Upgrade in Billing."
    )
  }
  const invite = await preEmploymentStore.create(input, user.email)
  recordPreEmploymentInvited(invite.email, getPreEmploymentFullName(invite))
  return invite
}

function getPreEmploymentFullName(
  invite: Pick<PreEmploymentInvite, "firstName" | "lastName">
) {
  return `${invite.firstName} ${invite.lastName}`.trim()
}

export async function savePreEmploymentProgress(
  token: string,
  payload: Partial<PreEmploymentFormData>
): Promise<PreEmploymentInvite> {
  return preEmploymentStore.saveProgress(token, payload)
}

export async function submitPreEmploymentForm(
  token: string,
  payload: PreEmploymentFormData
): Promise<PreEmploymentInvite> {
  const invite = await preEmploymentStore.submit(token, payload)
  recordPreEmploymentSubmitted(invite.email, getPreEmploymentFullName(invite))
  return invite
}

export async function rejectPreEmploymentInvite(
  id: string,
  note?: string
): Promise<PreEmploymentInvite> {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  return preEmploymentStore.reject(id, note)
}

export async function approvePreEmploymentInvite(
  id: string,
  employment: ApprovePreEmploymentInput
): Promise<ApprovePreEmploymentResult> {
  const user = requireSessionUser()
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  const subscription = getOrgSubscriptionForUser(user)
  if (!hasSubscriptionFeature(subscription, "employee_onboarding")) {
    throw new ForbiddenError(
      "Your plan does not include employee onboarding. Upgrade in Billing."
    )
  }

  const invite = await preEmploymentStore.getById(id)
  if (!invite) throw new Error("Invite not found")
  if (invite.status !== "submitted") {
    throw new Error("Only submitted invites can be approved")
  }

  const list = await employeeStore.list()
  if (!canAddSeat(subscription, list.length)) {
    throw new ForbiddenError(
      `Seat limit reached (${subscription.seatLimit}). Upgrade your plan or remove employees.`
    )
  }
  if (list.some(e => e.employeeId === employment.employeeId)) {
    throw new Error("Employee ID already exists")
  }

  const hrCountersignatures = employment.hrContractCountersignatures ?? []
  const approvalValidation = validateInviteForApproval(invite, hrCountersignatures)
  if (!approvalValidation.valid) {
    throw new Error(approvalValidation.errors.join(". "))
  }

  const payload = invite.candidatePayload as PreEmploymentFormData
  const now = new Date().toISOString()

  const emergency =
    payload.emergencyContactName?.trim() ||
    payload.emergencyContactPhone?.trim() ||
    payload.emergencyContactRelationship?.trim()
      ? {
          name: payload.emergencyContactName?.trim() || undefined,
          phone: payload.emergencyContactPhone?.trim() || undefined,
          relationship:
            payload.emergencyContactRelationship?.trim() || undefined,
        }
      : undefined

  const requirementCtx = buildRequirementContextFromInvite({
    ...invite,
    intendedEmploymentType: employment.employmentType as EmploymentType,
    intendedWorkLocation: employment.workLocation as WorkLocation,
    candidatePayload: payload,
  })

  const documents = mapPreEmploymentToEmployeeDocuments(
    payload,
    hrCountersignatures,
    invite.email
  )

  const input: CreateEmployeeInput = {
    employeeId: employment.employeeId,
    firstName: invite.firstName,
    lastName: invite.lastName,
    demographics: {
      dateOfBirth: payload.dateOfBirth || undefined,
      gender: toGender(payload.gender),
      nationality: payload.nationality?.trim() || undefined,
      maritalStatus: payload.maritalStatus?.trim() || undefined,
    },
    contact: {
      email: invite.email,
      phone: payload.phone,
      address: toStoredAddress(payload.address),
    },
    photoUrl: payload.photoUrl || undefined,
    preferredName: payload.preferredName?.trim() || undefined,
    personalEmail: payload.personalEmail?.trim() || undefined,
    emergencyContact: emergency,
    department: employment.department,
    position: employment.position,
    jobTitle: employment.jobTitle,
    isManager: employment.isManager,
    managerId: employment.managerId || undefined,
    workLocation: employment.workLocation as WorkLocation,
    employmentType: employment.employmentType as EmploymentType,
    lifecycle: {
      hireDate: employment.hireDate,
      probationEndDate:
        employment.probationEndDate ??
        computeProbationEnd(employment.hireDate) ??
        undefined,
      regularizationDate:
        employment.regularizationDate ??
        computeRegularizationDate(
          employment.hireDate,
          employment.probationEndDate ??
            computeProbationEnd(employment.hireDate)
        ) ??
        undefined,
    },
    status: resolveStatusForCreate(
      employment.statusDetail as "regular" | "probationary"
    ).status,
    statusDetail: resolveStatusForCreate(
      employment.statusDetail as "regular" | "probationary"
    ).statusDetail,
    contractSignedDate: employment.contractSignedDate,
    regularizationDate:
      employment.regularizationDate ??
      computeRegularizationDate(
        employment.hireDate,
        employment.probationEndDate ?? computeProbationEnd(employment.hireDate)
      ),
    documents,
    onboardingChecklist: deriveChecklistStatus(documents, requirementCtx),
    compliance: {
      dataSubjectAccessSigned: payload.acknowledgeHandbook,
    },
    profileOnboardingComplete: false,
    preEmploymentCompletedAt: now,
  }

  const created = await employeeStore.create({
    ...input,
    status: "onboarding",
    audit: { createdBy: user.email, updatedBy: user.email },
  })

  provisionPortalUser({
    email: invite.email,
    employeeId: created.id,
    name: getPreEmploymentFullName(invite),
    organizationId: resolveOrganizationId(user),
    organizationName: resolveOrganizationName(user),
  })

  const approved = await preEmploymentStore.markApproved(id, created.id)
  recordEmployeeCreated(
    created.employeeId,
    `${created.firstName} ${created.lastName}`.trim()
  )
  recordPreEmploymentApproved(invite.email, getPreEmploymentFullName(invite))

  return {
    invite: approved,
    employeeId: created.employeeId,
    loginEmail: invite.email,
    tempPasswordHint: MOCK_TEMP_PASSWORD_HINT,
  }
}

export function buildJoinUrl(token: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/join/${token}`
  }
  return `/join/${token}`
}

export async function suggestEmployeeIdForApproval(): Promise<string> {
  requireSessionPermission(PERMISSIONS.EMPLOYEES_CREATE)
  return employeeStore.getNextEmployeeId()
}
