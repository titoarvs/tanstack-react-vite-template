import { redirect } from "@tanstack/react-router"
import { getPreEmploymentInviteByToken } from "./api/preEmploymentApi"
import {
  PRE_EMPLOYMENT_EDITABLE_STATUSES,
  PRE_EMPLOYMENT_WAITING_STATUSES,
} from "./types"

export async function requireJoinPortalAccess({
  params,
}: {
  params: { token: string }
}) {
  try {
    const invite = await getPreEmploymentInviteByToken(params.token)
    if (!PRE_EMPLOYMENT_EDITABLE_STATUSES.includes(invite.status)) {
      if (PRE_EMPLOYMENT_WAITING_STATUSES.includes(invite.status)) {
        throw redirect({
          to: "/join/$token/submitted",
          params: { token: params.token },
        })
      }
      if (invite.status === "approved") {
        throw redirect({ to: "/login" })
      }
      throw redirect({ to: "/" })
    }
  } catch (e) {
    if (e && typeof e === "object" && "to" in e) throw e
    throw redirect({ to: "/" })
  }
}

export async function requireJoinSubmittedAccess({
  params,
}: {
  params: { token: string }
}) {
  try {
    const invite = await getPreEmploymentInviteByToken(params.token)
    if (invite.status === "approved") {
      throw redirect({ to: "/login" })
    }
    if (!PRE_EMPLOYMENT_WAITING_STATUSES.includes(invite.status)) {
      throw redirect({ to: "/join/$token", params: { token: params.token } })
    }
  } catch (e) {
    if (e && typeof e === "object" && "to" in e) throw e
    throw redirect({ to: "/" })
  }
}
