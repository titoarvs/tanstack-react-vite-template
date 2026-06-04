import { createContext } from "react"

export interface SidebarContextValue {
  mobileOpen: boolean
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
  collapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export const SIDEBAR_COLLAPSED_KEY = "titohris-sidebar-collapsed"
