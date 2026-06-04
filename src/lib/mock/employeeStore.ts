import type { CreateEmployeeInput, Employee } from "../../features/employees/types"
import { seedEmployees } from "./seedEmployees"

function delay(ms = 80) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 70))
}

class EmployeeStore {
  private employees = new Map<string, Employee>()

  constructor() {
    seedEmployees.forEach(e => this.employees.set(e.id, { ...e }))
  }

  async list(): Promise<Employee[]> {
    await delay()
    return Array.from(this.employees.values()).sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    )
  }

  async getById(id: string): Promise<Employee | undefined> {
    await delay()
    return this.employees.get(id)
  }

  async create(input: CreateEmployeeInput): Promise<Employee> {
    await delay(120)
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const employee: Employee = {
      profileOnboardingComplete: false,
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
    }
    this.employees.set(id, employee)
    return employee
  }

  getByIdSync(id: string): Employee | undefined {
    return this.employees.get(id)
  }

  async updateProfile(
    id: string,
    patch: {
      demographics?: Partial<Employee["demographics"]>
      contact?: Partial<Employee["contact"]>
      photoUrl?: string
      preferredName?: string
      personalEmail?: string
      emergencyContact?: Employee["emergencyContact"]
      profileOnboardingComplete?: boolean
      profileOnboardingCompletedAt?: string
    }
  ): Promise<Employee> {
    await delay(80)
    const existing = this.employees.get(id)
    if (!existing) throw new Error("Employee not found")
    const updated: Employee = {
      ...existing,
      ...patch,
      demographics: { ...existing.demographics, ...patch.demographics },
      contact: { ...existing.contact, ...patch.contact },
      emergencyContact: patch.emergencyContact
        ? { ...existing.emergencyContact, ...patch.emergencyContact }
        : existing.emergencyContact,
      updatedAt: new Date().toISOString(),
    }
    this.employees.set(id, updated)
    return updated
  }

  async remove(id: string): Promise<boolean> {
    await delay()
    return this.employees.delete(id)
  }

  getNextEmployeeId(extraReserved: Iterable<string> = []): string {
    const reserved = new Set(extraReserved)
    for (const employee of this.employees.values()) {
      reserved.add(employee.employeeId)
    }

    const nums = Array.from(reserved)
      .map(id => {
        const match = id.match(/EMP-(\d+)/i)
        return match ? parseInt(match[1], 10) : 0
      })
      .filter(n => !Number.isNaN(n))

    let next = nums.length ? Math.max(...nums) + 1 : 1
    let candidate = `EMP-${String(next).padStart(3, "0")}`
    while (reserved.has(candidate)) {
      next += 1
      candidate = `EMP-${String(next).padStart(3, "0")}`
    }
    return candidate
  }
}

export const employeeStore = new EmployeeStore()
