import { Check } from "lucide-react"
import { themeDefinitions } from "@/config/themes"
import { cn } from "@/lib/utils"
import { useTheme } from "../useTheme"

export function ThemeSelector() {
  const { themeId, setThemeId } = useTheme()

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {themeDefinitions.map(theme => {
        const selected = themeId === theme.id
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => setThemeId(theme.id)}
            className={cn(
              "relative flex flex-col overflow-hidden rounded-xl border text-left transition-colors",
              selected
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/40"
            )}
          >
            <div
              className="flex h-20 items-end gap-2 border-b border-border/60 p-3"
              style={{ backgroundColor: theme.preview.background }}
            >
              <span
                className="h-8 w-8 rounded-lg shadow-sm"
                style={{ backgroundColor: theme.preview.accent }}
              />
              <span
                className="mb-1 h-2 flex-1 rounded-full opacity-30"
                style={{ backgroundColor: theme.preview.foreground }}
              />
            </div>
            <div className="space-y-1 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{theme.label}</p>
                {selected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    <Check className="h-3 w-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{theme.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
