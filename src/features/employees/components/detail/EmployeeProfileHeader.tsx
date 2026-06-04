/** Profile tab definitions shared by toolbar and page */
export const PROFILE_TABS = [
  { value: "personal", label: "Personal" },
  { value: "job", label: "Job" },
  { value: "time-off", label: "Time Off" },
  { value: "pay-info", label: "Pay Info" },
  { value: "performance", label: "Performance" },
  { value: "documents", label: "Documents", disabled: true },
] as const

export type ProfileTabValue = (typeof PROFILE_TABS)[number]["value"]
