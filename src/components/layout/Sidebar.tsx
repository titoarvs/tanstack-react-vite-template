import { Link, useRouterState } from "@tanstack/react-router"
import { LogOut, X } from "lucide-react"
import type { ReactNode } from "react"
import { useNavigate } from "@tanstack/react-router"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { RoleBadge } from "@/features/auth/components/RoleBadge"
import { getEmployeeNavTarget } from "@/features/auth/accessPolicy"
import {
  canAccessEmployeesModule,
  canViewEmployeeDirectory,
  type Permission,
} from "@/features/auth/permissions"
import type { AuthUser } from "@/features/auth/types"
import { useAuth } from "@/features/auth/useAuth"
import {
  sidebarSections,
  type SidebarNavItem,
  type SidebarNavSection,
} from "./sidebarNavConfig"
import { SidebarCollapseToggle } from "./SidebarCollapseToggle"
import { useSidebar } from "./useSidebar"

function canSeeNavItem(
  item: SidebarNavItem,
  user: AuthUser | null,
  can: (permission: Permission) => boolean
): boolean {
  if (!user) return false
  if (item.roles && !item.roles.includes(user.role)) return false
  if (item.permission && !can(item.permission)) return false
  if (item.anyPermission && !item.anyPermission.some(p => can(p))) return false
  return true
}

function filterNavItems(
  items: SidebarNavItem[],
  user: AuthUser | null,
  can: (permission: Permission) => boolean
): SidebarNavItem[] {
  return items.filter(item => {
    if (item.id === "employees" && !canAccessEmployeesModule(user)) return false
    return canSeeNavItem(item, user, can)
  })
}

function resolveNavItems(
  items: SidebarNavItem[],
  user: AuthUser | null,
  employeeNavTo: string
): SidebarNavItem[] {
  const ownRecordOnly =
    user && canAccessEmployeesModule(user) && !canViewEmployeeDirectory(user)

  return items.map(item => {
    if (item.id !== "employees") return item
    return {
      ...item,
      to: employeeNavTo,
      label: ownRecordOnly ? "My employment" : "Employees",
    }
  })
}

function sectionTitle(
  section: SidebarNavSection,
  user: AuthUser | null
): string {
  if (user?.role === "employee" && section.titleForEmployee) {
    return section.titleForEmployee
  }
  return section.title
}

interface SidebarProps {
  id?: string
}

function SidebarHeader({
  collapsed,
  showCollapseToggle,
  trailing,
}: {
  collapsed: boolean
  showCollapseToggle: boolean
  trailing?: ReactNode
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col border-b border-border",
        collapsed
          ? "items-center gap-2 px-2 py-3"
          : "gap-0 px-4 py-4 lg:px-5 lg:py-5"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center",
          collapsed ? "flex-col gap-2" : "justify-between gap-2"
        )}
      >
        <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
          <TitoLogo showWordmark={!collapsed} size={collapsed ? "sm" : "md"} />
        </div>
        {trailing}
        {showCollapseToggle && !trailing && (
          <SidebarCollapseToggle collapsed={collapsed} />
        )}
      </div>
    </div>
  )
}

function SidebarNavLink({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: SidebarNavItem
  pathname: string
  collapsed: boolean
  onNavigate: () => void
}) {
  const active = item.isActive?.(pathname) ?? false

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex items-center rounded-lg text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
        active
          ? "bg-sidebar-active-bg text-sidebar-active-fg"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-indicator" />
      )}
      {active && collapsed && (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-sidebar-indicator" />
      )}
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.staticModuleId && (
            <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Soon
            </span>
          )}
        </>
      )}
    </Link>
  )
}

function NavSection({
  title,
  items,
  pathname,
  collapsed,
  onNavigate,
  className,
}: {
  title: string
  items: SidebarNavItem[]
  pathname: string
  collapsed: boolean
  onNavigate: () => void
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <div className={className}>
      {!collapsed && (
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      {collapsed && <div className="my-2 border-t border-border" aria-hidden />}
      <ul className="space-y-0.5">
        {items.map(item => (
          <li key={item.id}>
            <SidebarNavLink
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SidebarNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string
  collapsed: boolean
  onNavigate: () => void
}) {
  const { user, requestLogout, can } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.name ?? "Guest"
  const employeeNavTo = getEmployeeNavTarget(user)

  const visibleSections = sidebarSections
    .map(section => ({
      ...section,
      title: sectionTitle(section, user),
      items: resolveNavItems(
        filterNavItems(section.items, user, can),
        user,
        employeeNavTo
      ),
    }))
    .filter(section => section.items.length > 0)

  function handleLogout() {
    requestLogout(() => {
      onNavigate()
      navigate({ to: "/login" })
    })
  }

  return (
    <>
      <nav
        className={cn(
          "flex-1 overflow-y-auto overscroll-contain py-3",
          collapsed ? "px-2" : "px-3"
        )}
      >
        {visibleSections.map((section, index) => (
          <NavSection
            key={section.id}
            title={section.title}
            items={section.items}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
            className={index < visibleSections.length - 1 ? "mb-6" : undefined}
          />
        ))}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-border",
          collapsed ? "px-2 py-3" : "px-3 py-4"
        )}
      >
        <div
          className={cn(
            "flex items-center rounded-lg",
            collapsed ? "justify-center py-2" : "gap-3 px-3 py-2"
          )}
          title={collapsed ? displayName : undefined}
        >
          <EmployeeAvatar name={displayName} className="h-10 w-10" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{displayName}</p>
              {user?.role ? (
                <RoleBadge role={user.role} className="mt-1 text-[10px]" />
              ) : (
                <p className="truncate text-xs text-muted-foreground">Guest</p>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "mt-2 flex w-full items-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  )
}

export function Sidebar({ id = "app-sidebar" }: SidebarProps) {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const { mobileOpen, closeMobile, collapsed } = useSidebar()

  const mobileCloseButton = (
    <button
      type="button"
      onClick={closeMobile}
      className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
      aria-label="Close menu"
    >
      <X className="h-5 w-5" />
    </button>
  )

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        id={id}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] max-w-[85vw] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal={mobileOpen}
        aria-hidden={!mobileOpen}
      >
        <SidebarHeader
          collapsed={false}
          showCollapseToggle={false}
          trailing={mobileCloseButton}
        />
        <SidebarNav
          pathname={pathname}
          collapsed={false}
          onNavigate={closeMobile}
        />
      </aside>

      <aside
        className={cn(
          "hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300 ease-out lg:flex",
          collapsed
            ? "w-[var(--sidebar-width-collapsed)]"
            : "w-[var(--sidebar-width)]"
        )}
        aria-expanded={!collapsed}
      >
        <SidebarHeader collapsed={collapsed} showCollapseToggle />
        <SidebarNav
          pathname={pathname}
          collapsed={collapsed}
          onNavigate={() => undefined}
        />
      </aside>
    </>
  )
}
