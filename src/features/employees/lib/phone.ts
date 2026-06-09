import {
  DEFAULT_PHONE_COUNTRY_ISO,
  DEFAULT_PHONE_DIAL_CODE,
} from "../data/locationConstants"

/** Example shown in placeholders and helper text. */
export const PH_MOBILE_EXAMPLE = "+63 912 345 6789"
export const PH_MOBILE_PLACEHOLDER = "912 345 6789"

const PH_MOBILE_DIGITS = 10

export function parseStoredPhone(value?: string): {
  iso: string
  national: string
} {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) {
    return { iso: DEFAULT_PHONE_COUNTRY_ISO, national: "" }
  }

  const digits = trimmed.replace(/\D/g, "")
  if (!digits) {
    return { iso: DEFAULT_PHONE_COUNTRY_ISO, national: "" }
  }

  if (trimmed.startsWith("+")) {
    if (digits.startsWith("63")) {
      return { iso: "PH", national: sanitizePhilippineNational(digits.slice(2)) }
    }
    return { iso: DEFAULT_PHONE_COUNTRY_ISO, national: digits }
  }

  if (digits.startsWith("63") && digits.length >= 12) {
    return { iso: "PH", national: sanitizePhilippineNational(digits.slice(2)) }
  }

  if (digits.startsWith("0")) {
    return {
      iso: DEFAULT_PHONE_COUNTRY_ISO,
      national: sanitizePhilippineNational(digits.slice(1)),
    }
  }

  return {
    iso: DEFAULT_PHONE_COUNTRY_ISO,
    national: sanitizePhilippineNational(digits),
  }
}

export function sanitizePhilippineNational(input: string): string {
  let digits = input.replace(/\D/g, "")
  if (digits.startsWith("63")) digits = digits.slice(2)
  if (digits.startsWith("0")) digits = digits.slice(1)
  return digits.slice(0, PH_MOBILE_DIGITS)
}

export function formatPhilippineMobileDisplay(digits: string): string {
  const normalized = sanitizePhilippineNational(digits)
  if (!normalized) return ""
  if (normalized.length <= 3) return normalized
  if (normalized.length <= 6) {
    return `${normalized.slice(0, 3)} ${normalized.slice(3)}`
  }
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`
}

export function formatNationalDisplay(iso: string, national: string): string {
  const digits = national.replace(/\D/g, "")
  if (!digits) return ""

  if (iso === DEFAULT_PHONE_COUNTRY_ISO) {
    return formatPhilippineMobileDisplay(digits)
  }

  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim()
}

export function formatDisplayPhone(value?: string, phonecode?: string): string {
  const { iso, national } = parseStoredPhone(value)
  if (!national) return ""

  const formattedNational = formatNationalDisplay(iso, national)
  if (iso === DEFAULT_PHONE_COUNTRY_ISO) {
    return `${DEFAULT_PHONE_DIAL_CODE} ${formattedNational}`
  }

  if (phonecode) return `+${phonecode} ${formattedNational}`
  return `+${formattedNational.replace(/\s/g, "")}`
}

export function formatStoredPhone(
  iso: string,
  national: string,
  phonecode?: string
): string {
  const digits =
    iso === DEFAULT_PHONE_COUNTRY_ISO
      ? sanitizePhilippineNational(national)
      : national.replace(/\D/g, "")
  if (!digits) return ""

  if (iso === DEFAULT_PHONE_COUNTRY_ISO) {
    return `0${digits}`
  }

  if (phonecode) return `+${phonecode}${digits}`
  return `+${digits}`
}

export function getDefaultPhoneDialCode(): string {
  return DEFAULT_PHONE_DIAL_CODE
}

export function getPhonePlaceholder(iso: string): string {
  return iso === DEFAULT_PHONE_COUNTRY_ISO
    ? PH_MOBILE_PLACEHOLDER
    : "Enter mobile number"
}

export function getPhoneExample(iso: string, dialCode?: string): string | undefined {
  if (iso === DEFAULT_PHONE_COUNTRY_ISO) return PH_MOBILE_EXAMPLE
  if (dialCode) return `${dialCode} …`
  return undefined
}
