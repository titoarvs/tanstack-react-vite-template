import {
  DEFAULT_THEME_ID,
  getThemeDefinition,
  isThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "@/config/themes"

export function getStoredThemeId(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isThemeId(stored)) return stored
  } catch {
    // ignore storage errors
  }
  return DEFAULT_THEME_ID
}

export function setStoredThemeId(themeId: ThemeId) {
  localStorage.setItem(THEME_STORAGE_KEY, themeId)
}

export function applyThemeToDocument(themeId: ThemeId) {
  const theme = getThemeDefinition(themeId)
  const root = document.documentElement

  root.setAttribute("data-theme", themeId)
  root.classList.toggle("dark", theme.mode === "dark")
  root.style.colorScheme = theme.mode
}

export function initTheme() {
  applyThemeToDocument(getStoredThemeId())
}
