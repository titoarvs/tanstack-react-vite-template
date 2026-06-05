import type { EdmFieldKey } from "./types"

/** Mask sensitive values for Limited View access */
export function maskValue(fieldKey: EdmFieldKey, value: string | undefined): string {
  if (!value?.trim()) return "—"

  switch (fieldKey) {
    case "name":
      return maskName(value)
    case "contact":
    case "emergencyContact":
      return maskPhone(value)
    case "address":
      return maskAddress(value)
    case "employeePhoto":
      return "[Photo on file]"
    case "demographics":
      return "[Confidential]"
    case "dateContractSigned":
    case "terminationDate":
      return maskDate(value)
    case "monthlySalary":
      return maskCurrency(value)
    case "salaryGrade":
    case "compensationEffectiveDate":
      return maskPartial(value)
    case "governmentIds":
      return maskGovernmentId(value)
    default:
      return maskPartial(value)
  }
}

function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return `${parts[0].charAt(0)}.`
  }
  const first = parts[0]
  const last = parts[parts.length - 1]
  return `${first.charAt(0)}. ${last.charAt(0)}${"*".repeat(Math.max(last.length - 1, 2))}`
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 4) return "***"
  return `***-***-${digits.slice(-4)}`
}

function maskAddress(address: string): string {
  const words = address.split(/\s+/)
  if (words.length <= 1) return "***"
  return `${words[0]} ***`
}

function maskDate(date: string): string {
  const year = date.slice(0, 4)
  return year ? `****-**-** (${year})` : "****-**-**"
}

function maskCurrency(value: string): string {
  const num = parseFloat(value.replace(/[^\d.]/g, ""))
  if (Number.isNaN(num)) return "****"
  const magnitude = Math.floor(Math.log10(num)) + 1
  return `${"*".repeat(Math.min(magnitude, 6))} (range hidden)`
}

function maskPartial(value: string): string {
  if (value.length <= 2) return "**"
  return `${value.slice(0, 1)}${"*".repeat(Math.min(value.length - 1, 6))}`
}

function maskGovernmentId(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length < 4) return "***-***"
  return `***-**-${digits.slice(-4)}`
}

export function formatCurrency(value: number | undefined): string {
  if (value == null) return "—"
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatBoolean(value: boolean | undefined): string {
  if (value == null) return "—"
  return value ? "Yes" : "No"
}
