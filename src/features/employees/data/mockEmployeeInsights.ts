import type { Employee } from "../types"

export interface WeeklyAttendancePoint {
  week: string
  rate: number
}

export interface LeaveBalanceRow {
  type: string
  used: number
  remaining: number
}

export interface EmployeeInsights {
  attendanceRate: number
  weeklyAttendance: WeeklyAttendancePoint[]
  leaveBalances: LeaveBalanceRow[]
  leaveDaysUsedYtd: number
}

export interface MonthlyPayPoint {
  month: string
  net: number
}

export interface WeeklyEarningsPoint {
  day: string
  amount: number
  hours?: number
}

export interface PayMetricTrend {
  gross: { value: string; positive: boolean }
  taxes: { value: string; positive: boolean }
  deductions: { value: string; positive: boolean }
}

export interface PayYtdSegment {
  name: string
  value: number
  colorKey: "net" | "taxes" | "deductions"
}

export interface PaystubHistoryRow {
  payDate: string
  payDateIso: string
  gross: number
  taxes: number
  deductions: number
  net: number
  ytdNet: number
}

export interface EmployeePayInsights {
  latestPayDate: string
  latestPayDateLabel: string
  periodEndLabel: string
  netPay: number
  grossPay: number
  taxes: number
  deductions: number
  taxesPct: number
  deductionsPct: number
  monthlyNetTrend: MonthlyPayPoint[]
  weeklyEarnings: WeeklyEarningsPoint[]
  metricTrends: PayMetricTrend
  ytdGross: number
  ytdSegments: PayYtdSegment[]
  paystubHistory: PaystubHistoryRow[]
}

function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatTenureDetailed(hireDate: string): string {
  const hire = new Date(hireDate)
  if (Number.isNaN(hire.getTime())) return "—"
  const now = new Date()
  let years = now.getFullYear() - hire.getFullYear()
  let months = now.getMonth() - hire.getMonth()
  let days = now.getDate() - hire.getDate()
  if (days < 0) {
    months -= 1
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  const parts: string[] = []
  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}m`)
  parts.push(`${Math.max(0, days)}d`)
  return parts.join(" - ")
}

export function formatTenure(hireDate: string): string {
  const hire = new Date(hireDate)
  if (Number.isNaN(hire.getTime())) return "—"
  const now = new Date()
  let months =
    (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth())
  if (now.getDate() < hire.getDate()) months -= 1
  if (months < 1) return "< 1 month"
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years === 0) return `${rem} mo`
  if (rem === 0) return `${years} yr`
  return `${years} yr ${rem} mo`
}

export function countDirectReports(managerId: string, employees: Employee[]): number {
  return employees.filter(e => e.managerId === managerId).length
}

export function getEmployeeInsights(employeeId: string): EmployeeInsights {
  const seed = seedFromId(employeeId)
  const baseRate = 82 + Math.floor(pseudoRandom(seed, 0) * 14)

  const weekLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]
  const weeklyAttendance: WeeklyAttendancePoint[] = weekLabels.map((week, i) => {
    const jitter = (pseudoRandom(seed, i + 1) - 0.5) * 12
    const rate = Math.min(100, Math.max(68, Math.round(baseRate + jitter)))
    return { week, rate }
  })

  const leaveBalances: LeaveBalanceRow[] = [
    {
      type: "Annual",
      used: 4 + Math.floor(pseudoRandom(seed, 20) * 8),
      remaining: 8 + Math.floor(pseudoRandom(seed, 21) * 6),
    },
    {
      type: "Sick",
      used: Math.floor(pseudoRandom(seed, 22) * 4),
      remaining: 10 - Math.floor(pseudoRandom(seed, 23) * 3),
    },
    {
      type: "Personal",
      used: Math.floor(pseudoRandom(seed, 24) * 3),
      remaining: 4 + Math.floor(pseudoRandom(seed, 25) * 2),
    },
  ]

  const leaveDaysUsedYtd = leaveBalances.reduce((sum, row) => sum + row.used, 0)

  return {
    attendanceRate: baseRate,
    weeklyAttendance,
    leaveBalances,
    leaveDaysUsedYtd,
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function getEmployeePayInsights(employeeId: string): EmployeePayInsights {
  const seed = seedFromId(employeeId)
  const netPay = Math.round((2200 + pseudoRandom(seed, 30) * 1800) * 100) / 100
  const taxRate = 0.22 + pseudoRandom(seed, 31) * 0.08
  const dedRate = 0.06 + pseudoRandom(seed, 32) * 0.04
  const grossPay = Math.round((netPay / (1 - taxRate - dedRate)) * 100) / 100
  const taxes = Math.round(grossPay * taxRate * 100) / 100
  const deductions = Math.round((grossPay - taxes - netPay) * 100) / 100
  const taxesPct = Math.round((taxes / grossPay) * 1000) / 10
  const deductionsPct = Math.round((deductions / grossPay) * 1000) / 10

  const monthlyNetTrend: MonthlyPayPoint[] = MONTHS.map((month, i) => ({
    month,
    net: Math.round((netPay * (0.92 + pseudoRandom(seed, 40 + i) * 0.16)) * 100) / 100,
  }))

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const weeklyEarnings: WeeklyEarningsPoint[] = days.map((day, i) => {
    const amount = Math.round((netPay / 5) * (0.3 + pseudoRandom(seed, 60 + i) * 0.9) * 100) / 100
    const hours = i === 0 || i === 6 ? 0 : Math.round(6 + pseudoRandom(seed, 70 + i) * 4)
    return { day, amount: i === 0 || i === 6 ? 0 : amount, hours: hours || undefined }
  })

  const metricTrends: PayMetricTrend = {
    gross: {
      value: `+${Math.round(60 + pseudoRandom(seed, 80) * 30)}%`,
      positive: true,
    },
    taxes: {
      value: `+${Math.round(15 + pseudoRandom(seed, 81) * 15)}%`,
      positive: true,
    },
    deductions: {
      value: `-${(pseudoRandom(seed, 82) * 6 + 2).toFixed(1)}%`,
      positive: false,
    },
  }

  const ytdGross = Math.round(grossPay * 8 * 100) / 100
  const ytdNet = Math.round(netPay * 8 * 100) / 100
  const ytdTaxes = Math.round(taxes * 8 * 100) / 100
  const ytdDeductions = Math.round(deductions * 8 * 100) / 100

  const paystubHistory: PaystubHistoryRow[] = Array.from({ length: 8 }, (_, i) => {
    const monthIndex = 11 - i
    const d = new Date(2022, monthIndex, 4)
    const iso = d.toISOString().slice(0, 10)
    const scale = 0.94 + pseudoRandom(seed, 50 + i) * 0.1
    const rowGross = Math.round(grossPay * scale * 100) / 100
    const rowTaxes = Math.round(taxes * scale * 100) / 100
    const rowDed = Math.round(deductions * scale * 100) / 100
    const rowNet = Math.round(netPay * scale * 100) / 100
    return {
      payDate: formatDisplayDate(iso),
      payDateIso: iso,
      gross: rowGross,
      taxes: rowTaxes,
      deductions: rowDed,
      net: rowNet,
      ytdNet: Math.round(ytdNet * ((8 - i) / 8) * 100) / 100,
    }
  })

  return {
    latestPayDate: "2022-05-04",
    latestPayDateLabel: formatDisplayDate("2022-05-04"),
    periodEndLabel: "12/03/2024",
    netPay,
    grossPay,
    taxes,
    deductions,
    taxesPct,
    deductionsPct,
    monthlyNetTrend,
    weeklyEarnings,
    metricTrends,
    ytdGross,
    ytdSegments: [
      { name: "Net pay (YTD)", value: ytdNet, colorKey: "net" },
      { name: "Taxes", value: ytdTaxes, colorKey: "taxes" },
      { name: "Deductions", value: ytdDeductions, colorKey: "deductions" },
    ],
    paystubHistory,
  }
}
