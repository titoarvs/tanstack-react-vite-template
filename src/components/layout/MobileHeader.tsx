import { Menu } from "lucide-react"
import { useSidebar } from "./useSidebar"

interface MobileHeaderProps {
  title?: string
}

export function MobileHeader({ title = "Employee" }: MobileHeaderProps) {
  const { toggleMobile, mobileOpen } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={toggleMobile}
        className="rounded-lg p-2 text-foreground hover:bg-muted"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-controls="app-sidebar"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-lg font-semibold text-foreground">{title}</span>
    </header>
  )
}
