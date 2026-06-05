import type {
  CreatePreEmploymentInviteInput,
  PreEmploymentFormData,
  PreEmploymentInvite,
  PreEmploymentStatus,
} from "@/features/pre-employment/types"

function delay(ms = 80) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 70))
}

function createToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 24)
}

const DEMO_INVITE: PreEmploymentInvite = {
  id: "pre-emp-demo-1",
  token: "demo-token",
  email: "candidate.demo@titohris.com",
  firstName: "Alex",
  lastName: "Rivera",
  intendedDepartment: "Engineering",
  intendedPosition: "Software Engineer",
  intendedHireDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  status: "invited",
  candidatePayload: {},
  invitedBy: "hr@titohris.com",
  invitedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
}

class PreEmploymentStore {
  private invites = new Map<string, PreEmploymentInvite>()
  private tokenIndex = new Map<string, string>()

  constructor() {
    this.invites.set(DEMO_INVITE.id, { ...DEMO_INVITE })
    this.tokenIndex.set(DEMO_INVITE.token, DEMO_INVITE.id)
  }

  async list(): Promise<PreEmploymentInvite[]> {
    await delay()
    return Array.from(this.invites.values()).sort(
      (a, b) => b.invitedAt.localeCompare(a.invitedAt)
    )
  }

  async getById(id: string): Promise<PreEmploymentInvite | undefined> {
    await delay()
    return this.invites.get(id)
  }

  async getByToken(token: string): Promise<PreEmploymentInvite | undefined> {
    await delay()
    const id = this.tokenIndex.get(token)
    if (!id) return undefined
    return this.invites.get(id)
  }

  getByTokenSync(token: string): PreEmploymentInvite | undefined {
    const id = this.tokenIndex.get(token)
    if (!id) return undefined
    return this.invites.get(id)
  }

  async create(
    input: CreatePreEmploymentInviteInput,
    invitedBy: string
  ): Promise<PreEmploymentInvite> {
    await delay(100)
    const id = crypto.randomUUID()
    const token = createToken()
    const now = new Date().toISOString()
    const invite: PreEmploymentInvite = {
      id,
      token,
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      intendedDepartment: input.intendedDepartment,
      intendedPosition: input.intendedPosition,
      intendedHireDate: input.intendedHireDate,
      status: "invited",
      candidatePayload: {},
      invitedBy,
      invitedAt: now,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    }
    this.invites.set(id, invite)
    this.tokenIndex.set(token, id)
    return invite
  }

  async saveProgress(
    token: string,
    payload: Partial<PreEmploymentFormData>
  ): Promise<PreEmploymentInvite> {
    await delay(60)
    const invite = await this.getByToken(token)
    if (!invite) throw new Error("Invite not found")
    if (!["invited", "in_progress", "rejected"].includes(invite.status)) {
      throw new Error("This invite can no longer be edited")
    }
    const updated: PreEmploymentInvite = {
      ...invite,
      status: invite.status === "invited" ? "in_progress" : invite.status,
      candidatePayload: { ...invite.candidatePayload, ...payload },
      rejectionNote: invite.status === "rejected" ? undefined : invite.rejectionNote,
    }
    this.invites.set(invite.id, updated)
    return updated
  }

  async submit(token: string, payload: PreEmploymentFormData): Promise<PreEmploymentInvite> {
    await delay(100)
    const invite = await this.getByToken(token)
    if (!invite) throw new Error("Invite not found")
    if (!["invited", "in_progress", "rejected"].includes(invite.status)) {
      throw new Error("This invite can no longer be submitted")
    }
    const updated: PreEmploymentInvite = {
      ...invite,
      status: "submitted",
      candidatePayload: payload,
      submittedAt: new Date().toISOString(),
      rejectionNote: undefined,
    }
    this.invites.set(invite.id, updated)
    return updated
  }

  async reject(id: string, note?: string): Promise<PreEmploymentInvite> {
    await delay(80)
    const invite = this.invites.get(id)
    if (!invite) throw new Error("Invite not found")
    if (invite.status !== "submitted") {
      throw new Error("Only submitted invites can be sent back for changes")
    }
    const updated: PreEmploymentInvite = {
      ...invite,
      status: "rejected",
      rejectionNote: note?.trim() || "Please review and update your submission.",
    }
    this.invites.set(id, updated)
    return updated
  }

  async markApproved(
    id: string,
    employeeRecordId: string
  ): Promise<PreEmploymentInvite> {
    await delay(80)
    const invite = this.invites.get(id)
    if (!invite) throw new Error("Invite not found")
    const updated: PreEmploymentInvite = {
      ...invite,
      status: "approved",
      employeeRecordId,
      approvedAt: new Date().toISOString(),
    }
    this.invites.set(id, updated)
    return updated
  }

  async cancel(id: string): Promise<PreEmploymentInvite> {
    await delay(60)
    const invite = this.invites.get(id)
    if (!invite) throw new Error("Invite not found")
    if (invite.status === "approved") throw new Error("Approved invites cannot be cancelled")
    const updated: PreEmploymentInvite = {
      ...invite,
      status: "cancelled",
    }
    this.invites.set(id, updated)
    return updated
  }

  countByStatus(status: PreEmploymentStatus): number {
    return Array.from(this.invites.values()).filter(i => i.status === status).length
  }
}

export const preEmploymentStore = new PreEmploymentStore()
