export type ThemeId = "light" | "dark" | "tito" | "tito-dark"

export interface ThemeDefinition {
  id: ThemeId
  label: string
  description: string
  mode: "light" | "dark"
  preview: {
    background: string
    foreground: string
    accent: string
  }
}

export const DEFAULT_THEME_ID: ThemeId = "light"

export const THEME_STORAGE_KEY = "titohris-theme"

export const themeDefinitions: ThemeDefinition[] = [
  {
    id: "light",
    label: "Light",
    description: "Clean default workspace with neutral surfaces.",
    mode: "light",
    preview: {
      background: "#ffffff",
      foreground: "#012241",
      accent: "#a8e049",
    },
  },
  {
    id: "dark",
    label: "Dark",
    description: "Grayscale dark mode for low-light environments.",
    mode: "dark",
    preview: {
      background: "#111111",
      foreground: "#ffffff",
      accent: "#7a7a7a",
    },
  },
  {
    id: "tito",
    label: "Tito Light",
    description: "Brand-forward light theme with soft blue surfaces.",
    mode: "light",
    preview: {
      background: "#f5fbfb",
      foreground: "#012241",
      accent: "#a8e049",
    },
  },
  {
    id: "tito-dark",
    label: "Tito Dark",
    description: "Deep navy workspace with vibrant Tito accents.",
    mode: "dark",
    preview: {
      background: "#012241",
      foreground: "#f5fbfb",
      accent: "#a8e049",
    },
  },
]

export const themeDefinitionMap = Object.fromEntries(
  themeDefinitions.map(theme => [theme.id, theme])
) as Record<ThemeId, ThemeDefinition>

export function isThemeId(value: string): value is ThemeId {
  return value in themeDefinitionMap
}

export function getThemeDefinition(id: ThemeId): ThemeDefinition {
  return themeDefinitionMap[id]
}
