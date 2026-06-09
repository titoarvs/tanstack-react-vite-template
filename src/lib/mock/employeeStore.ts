import type {
  CreateEmployeeInput,
  Employee,
  EmployeeCompensation,
  EmployeeCompliance,
  EmployeeGovernmentIds,
  EmployeeSystemAccess,
} from "../../features/employees/types"
import type { EmployeeDocument } from "../../features/employees/types/documents"
import { normalizeEmployee } from "../../features/employees/lib/normalizeEmployee"
import { seedEmployees } from "./seedEmployees"

function delay(ms = 80) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 70))
}

export type EmployeeUpdatePatch = {
  firstName?: string
  lastName?: string
  middleName?: string
  suffix?: string
  preferredName?: string
  personalEmail?: string
  photoUrl?: string
  department?: string
  position?: string
  jobTitle?: string
  isManager?: boolean
  managerId?: string
  orgLevel?: string
  businessUnit?: string
  costCenter?: string
  workLocation?: Employee["workLocation"]
  employmentType?: Employee["employmentType"]
  status?: Employee["status"]
  statusDetail?: Employee["statusDetail"]
  officeBranch?: string
  contractSignedDate?: string
  regularizationDate?: string
  separationReason?: string
  demographics?: Partial<Employee["demographics"]>
  contact?: Partial<Employee["contact"]>
  lifecycle?: Partial<Employee["lifecycle"]>
  emergencyContact?: Employee["emergencyContact"]
  compensation?: Partial<EmployeeCompensation>
  governmentIds?: Partial<EmployeeGovernmentIds>
  compliance?: Partial<EmployeeCompliance>
  systemAccess?: EmployeeSystemAccess
  documents?: EmployeeDocument[]
  profileOnboardingComplete?: boolean
  profileOnboardingCompletedAt?: string
  preEmploymentCompletedAt?: string
}

class EmployeeStore {
  private employees = new Map<string, Employee>()

  constructor() {
    seedEmployees.forEach(e => {
      this.employees.set(e.id, normalizeEmployee(e))
    })
  }

  async list(): Promise<Employee[]> {
    await delay()
    return Array.from(this.employees.values()).sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    )
  }

  async getById(id: string): Promise<Employee | undefined> {
    await delay()
    const e = this.employees.get(id)
    return e ? normalizeEmployee(e) : undefined
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    await delay(120)
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const employee = normalizeEmployee({
      ...input,
      profileOnboardingComplete: input.profileOnboardingComplete ?? false,
      id,
      createdAt: now,
      updatedAt: now,
      audit: { createdBy: "hris", updatedBy: "hris" },
    })
    this.employees.set(id, employee)
    return employee
  }

  getByIdSync(id: string): Employee | undefined {
    const e = this.employees.get(id)
    return e ? normalizeEmployee(e) : undefined
  }

  async updateEmployee(
    id: string,
    patch: EmployeeUpdatePatch,
    updatedBy = "system"
  ): Promise<Employee> {
    await delay(80)
    const existing = this.employees.get(id)
    if (!existing) throw new Error("Employee not found")

    const updated = normalizeEmployee({
      ...existing,
      ...patch,
      demographics: { ...existing.demographics, ...patch.demographics },
      contact: { ...existing.contact, ...patch.contact },
      lifecycle: { ...existing.lifecycle, ...patch.lifecycle },
      emergencyContact: patch.emergencyContact
        ? { ...existing.emergencyContact, ...patch.emergencyContact }
        : existing.emergencyContact,
      compensation: { ...existing.compensation, ...patch.compensation },
      governmentIds: { ...existing.governmentIds, ...patch.governmentIds },
      compliance: { ...existing.compliance, ...patch.compliance },
      systemAccess: patch.systemAccess ?? existing.systemAccess,
      documents: patch.documents ?? existing.documents,
      audit: {
        ...existing.audit,
        updatedBy,
      },
      updatedAt: new Date().toISOString(),
    })

    this.employees.set(id, updated)
    return updated
  }

  /** @deprecated use updateEmployee */
  async updateProfile(
    id: string,
    patch: EmployeeUpdatePatch
  ): Promise<Employee> {
    return this.updateEmployee(id, patch)
  }

  async remove(id: string): Promise<boolean> {
    await delay()
    return this.employees.delete(id)
  }

  getNextEmployeeId(reserved: string[] = []): string {
    const nums = Array.from(this.employees.values())
      .map(e => {
        const match = e.employeeId.match(/EMP-(\d+)/)
        return match ? parseInt(match[1], 10) : 0
      })
      .filter(n => !Number.isNaN(n))
    let next = nums.length ? Math.max(...nums) + 1 : 1
    let candidate = `EMP-${String(next).padStart(3, "0")}`
    while (
      Array.from(this.employees.values()).some(e => e.employeeId === candidate) ||
      reserved.includes(candidate)
    ) {
      next += 1
      candidate = `EMP-${String(next).padStart(3, "0")}`
    }
    return candidate
  }
}

export const employeeStore = new EmployeeStore()
