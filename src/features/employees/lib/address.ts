import { z } from "zod"
import { DEFAULT_ADDRESS_COUNTRY } from "../data/locationConstants"
import type { EmployeeAddress } from "../types"

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export function emptyAddress(): EmployeeAddress {
  return {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: DEFAULT_ADDRESS_COUNTRY,
  }
}

function withDefaultCountry(address: EmployeeAddress): EmployeeAddress {
  return {
    ...address,
    country: address.country?.trim() || DEFAULT_ADDRESS_COUNTRY,
  }
}

export function formatAddress(address?: EmployeeAddress | null): string | undefined {
  if (!address) return undefined
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ]
    .map(part => part?.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts.join(", ") : undefined
}

export function hasAddressContent(address?: EmployeeAddress | null): boolean {
  if (!address) return false
  return Boolean(
    address.street?.trim() ||
      address.city?.trim() ||
      address.state?.trim() ||
      address.zipCode?.trim() ||
      address.country?.trim()
  )
}

export function toStoredAddress(address?: EmployeeAddress | null): EmployeeAddress | undefined {
  if (!hasAddressContent(address)) return undefined
  return {
    street: address?.street?.trim() || undefined,
    city: address?.city?.trim() || undefined,
    state: address?.state?.trim() || undefined,
    zipCode: address?.zipCode?.trim() || undefined,
    country: address?.country?.trim() || undefined,
  }
}

/** Migrate legacy flat address + province into structured fields */
export function normalizeAddressInput(
  address?: EmployeeAddress | string | null,
  province?: string | null
): EmployeeAddress {
  if (address && typeof address === "object") {
    return withDefaultCountry({ ...emptyAddress(), ...address })
  }
  return withDefaultCountry({
    ...emptyAddress(),
    street: typeof address === "string" ? address : "",
    state: province ?? "",
  })
}

export function normalizeContactAddress(contact: {
  address?: EmployeeAddress | string
  province?: string
}): EmployeeAddress | undefined {
  const normalized = normalizeAddressInput(contact.address, contact.province)
  return toStoredAddress(normalized)
}
