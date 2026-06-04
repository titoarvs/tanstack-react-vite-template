import { useCallback, useEffect, useState, type ReactNode } from "react"
import { SIDEBAR_COLLAPSED_KEY, SidebarContext } from "./sidebarContextState"

function readCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  } catch {
    return false
  }
}

function persistCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  } catch {
    /* ignore */
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsedState] = useState(readCollapsedPreference)

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(o => !o), [])

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    persistCollapsed(value)
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsedState(prev => {
      const next = !prev
      persistCollapsed(next)
      return next
    })
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [closeMobile])

  return (
    <SidebarContext.Provider
      value={{
        mobileOpen,
        openMobile,
        closeMobile,
        toggleMobile,
        collapsed,
        toggleCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
