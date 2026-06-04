export type ActivityType = "hire" | "leave" | "onboarding" | "update" | "attendance"

export interface DashboardActivity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

export interface PendingLeaveRequest {
  id: string
  employeeName: string
  leaveType: string
  dates: string
  status: "pending" | "approved"
}

export interface WeeklyAttendance {
  day: string
  rate: number
}

export interface HeadcountTrendPoint {
  month: string
  total: number
  active: number
  hires: number
}

export interface LeaveTypeCount {
  type: string
  count: number
}

export const mockDashboardData = {
  attendanceRate: 94.2,
  pendingLeaveCount: 7,
  openPositions: 4,
  onboardingInProgress: 3,
  weeklyAttendance: [
    { day: "Mon", rate: 88 },
    { day: "Tue", rate: 92 },
    { day: "Wed", rate: 94 },
    { day: "Thu", rate: 91 },
    { day: "Fri", rate: 93 },
    { day: "Sat", rate: 45 },
    { day: "Sun", rate: 12 },
  ] satisfies WeeklyAttendance[],
  headcountTrend: [
    { month: "Jan", total: 38, active: 36, hires: 2 },
    { month: "Feb", total: 40, active: 38, hires: 3 },
    { month: "Mar", total: 41, active: 39, hires: 2 },
    { month: "Apr", total: 43, active: 41, hires: 4 },
    { month: "May", total: 44, active: 42, hires: 2 },
    { month: "Jun", total: 46, active: 44, hires: 3 },
  ] satisfies HeadcountTrendPoint[],
  leaveByType: [
    { type: "Annual", count: 12 },
    { type: "Sick", count: 5 },
    { type: "WFH", count: 8 },
    { type: "Unpaid", count: 2 },
  ] satisfies LeaveTypeCount[],
  activities: [
    {
      id: "a1",
      type: "hire",
      title: "New hire onboarded",
      description: "Rina Wijaya joined Product Design as UI Designer",
      timestamp: "2026-06-04T09:15:00Z",
    },
    {
      id: "a2",
      type: "leave",
      title: "Leave request submitted",
      description: "Budi Santoso requested 3 days annual leave",
      timestamp: "2026-06-04T08:40:00Z",
    },
    {
      id: "a3",
      type: "onboarding",
      title: "Onboarding step completed",
      description: "Employment info submitted for candidate #ONB-104",
      timestamp: "2026-06-03T16:20:00Z",
    },
    {
      id: "a4",
      type: "update",
      title: "Employee record updated",
      description: "Angela Neyvitri Raharja — department transfer to Finance",
      timestamp: "2026-06-03T11:05:00Z",
    },
    {
      id: "a5",
      type: "attendance",
      title: "Attendance flagged",
      description: "2 employees marked late check-in at Jakarta office",
      timestamp: "2026-06-03T07:55:00Z",
    },
  ] satisfies DashboardActivity[],
  pendingLeave: [
    {
      id: "l1",
      employeeName: "Budi Santoso",
      leaveType: "Annual leave",
      dates: "Jun 10 – Jun 12",
      status: "pending",
    },
    {
      id: "l2",
      employeeName: "Siti Rahayu",
      leaveType: "Sick leave",
      dates: "Jun 6",
      status: "pending",
    },
    {
      id: "l3",
      employeeName: "Michael Chen",
      leaveType: "Work from home",
      dates: "Jun 9",
      status: "pending",
    },
    {
      id: "l4",
      employeeName: "Jessica Lim",
      leaveType: "Annual leave",
      dates: "Jun 14 – Jun 16",
      status: "pending",
    },
  ] satisfies PendingLeaveRequest[],
}
