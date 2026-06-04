import { useTheme } from "@/features/settings/useTheme"
import { getChartColors, getEmploymentChartColors } from "../lib/chartColors"

export function useChartColors() {
  const { themeId } = useTheme()
  void themeId
  return getChartColors()
}

export function useEmploymentChartColors() {
  const { themeId } = useTheme()
  void themeId
  return getEmploymentChartColors()
}
