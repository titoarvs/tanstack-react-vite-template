/** Profile tab definitions shared by toolbar and page */
export const PROFILE_TABS = [
  { value: "personal", label: "Personal" },
  { value: "employment", label: "Employment" },
  { value: "compensation", label: "Compensation" },
  { value: "government", label: "Government" },
  { value: "documents", label: "Documents" },
  { value: "compliance", label: "Compliance" },
  { value: "access", label: "Access & Systems" },
  { value: "time-off", label: "Time Off" },
  { value: "performance", label: "Performance" },
] as const

export type ProfileTabValue = (typeof PROFILE_TABS)[number]["value"]

/** @deprecated use employment */
export type LegacyProfileTabValue = "job" | "pay-info"
