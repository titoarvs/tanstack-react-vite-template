import { useCallback, useRef, useState, type ReactNode } from "react"
import { type ThemeId } from "@/config/themes"
import { recordThemeChanged } from "@/features/audit/auditLogger"
import { applyThemeToDocument, getStoredThemeId, setStoredThemeId } from "./applyTheme"
import { ThemeContext } from "./themeContextState"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => getStoredThemeId())
  const skipFirstThemeAudit = useRef(true)

  const setThemeId = useCallback((nextThemeId: ThemeId) => {
    setStoredThemeId(nextThemeId)
    applyThemeToDocument(nextThemeId)
    setThemeIdState(nextThemeId)
    if (skipFirstThemeAudit.current) {
      skipFirstThemeAudit.current = false
      return
    }
    recordThemeChanged(nextThemeId)
  }, [])

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  )
}
