export interface ChartColorSet {
  green: string
  blue: string
  dullGreen: string
  dullBlue: string
  darkGreen: string
  foreground: string
  muted: string
  grid: string
  palette: string[]
}

function readVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function getChartColors(): ChartColorSet {
  const green = readVar("--chart-1", readVar("--tito-green", "#a8e049"))
  const blue = readVar("--chart-4", readVar("--tito-blue", "#012241"))
  const dullGreen = readVar("--chart-3", readVar("--tito-dull-green", "#7d9f52"))
  const dullBlue = readVar("--chart-2", readVar("--tito-dull-blue", "#223c6f"))
  const darkGreen = readVar("--chart-5", readVar("--tito-dark-green", "#1b3704"))
  const foreground = readVar("--foreground", "#012241")
  const muted = readVar("--muted-foreground", "#7a7a7a")
  const grid = readVar("--border", "#e5e7eb")

  const palette = [
    readVar("--chart-1", green),
    readVar("--chart-2", dullBlue),
    readVar("--chart-3", dullGreen),
    readVar("--chart-4", blue),
    readVar("--chart-5", darkGreen),
    readVar("--primary", blue),
  ]

  return {
    green,
    blue,
    dullGreen,
    dullBlue,
    darkGreen,
    foreground,
    muted,
    grid,
    palette,
  }
}

/** @deprecated Use getChartColors() for theme-aware colors */
export const chartColors = {
  green: "#a8e049",
  blue: "#012241",
  dullGreen: "#7d9f52",
  dullBlue: "#223c6f",
  darkGreen: "#1b3704",
  foreground: "#012241",
  muted: "#7a7a7a",
  grid: "oklch(0.9219 0.0096 242.3)",
}

export const chartPalette = [
  chartColors.green,
  chartColors.dullBlue,
  chartColors.dullGreen,
  chartColors.blue,
  chartColors.darkGreen,
  "#4a6741",
] as const

export const employmentChartColors: Record<string, string> = {
  "full-time": chartColors.dullBlue,
  internship: chartColors.green,
  contract: chartColors.dullGreen,
}

export function getEmploymentChartColors() {
  const colors = getChartColors()
  return {
    "full-time": colors.dullBlue,
    internship: colors.green,
    contract: colors.dullGreen,
  }
}
