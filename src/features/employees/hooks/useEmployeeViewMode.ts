import { useCallback, useState } from "react"
import type { EmployeeViewMode } from "../components/EmployeeViewToggle"

const STORAGE_KEY = "titohris-employee-view-mode"

function readViewMode(): EmployeeViewMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "table" || stored === "list") return "table"
    if (stored === "grid") return "grid"
  } catch {
    /* ignore */
  }
  return "table"
}

export function useEmployeeViewMode() {
  const [viewMode, setViewModeState] = useState<EmployeeViewMode>(readViewMode)

  const setViewMode = useCallback((mode: EmployeeViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
  }, [])

  return { viewMode, setViewMode }
}
