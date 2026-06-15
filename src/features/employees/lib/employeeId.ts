export const EMPLOYEE_ID_PREFIX = "TSPI"

const LEGACY_PREFIX = "EMP"

export function formatEmployeeId(sequence: number): string {
  return `${EMPLOYEE_ID_PREFIX}-${String(sequence).padStart(3, "0")}`
}

export function parseEmployeeIdSequence(employeeId: string): number | null {
  const match = employeeId.match(
    new RegExp(`^(?:${LEGACY_PREFIX}|${EMPLOYEE_ID_PREFIX})-(\\d+)$`)
  )
  if (!match) return null
  const sequence = parseInt(match[1], 10)
  return Number.isNaN(sequence) ? null : sequence
}
