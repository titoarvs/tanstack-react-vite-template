import { PanelLeft, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from "./useSidebar"

interface SidebarCollapseToggleProps {
  collapsed: boolean
  className?: string
}

export function SidebarCollapseToggle({ collapsed, className }: SidebarCollapseToggleProps) {
  const { toggleCollapsed } = useSidebar()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleCollapsed}
      className={cn("shrink-0 text-muted-foreground hover:text-foreground", className)}
      aria-label={collapsed ? "Maximize sidebar" : "Minimize sidebar"}
      title={collapsed ? "Maximize sidebar" : "Minimize sidebar"}
    >
      {collapsed ? (
        <PanelLeft className="h-5 w-5" aria-hidden />
      ) : (
        <PanelLeftClose className="h-5 w-5" aria-hidden />
      )}
    </Button>
  )
}
