/** Human-readable screen titles for route paths */
export function getPathTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname === "/settings") return "Settings"
  if (pathname === "/billing") return "Billing"
  if (pathname === "/checkout") return "Checkout"
  if (pathname === "/welcome") return "Welcome onboarding"
  if (pathname === "/privacy-consent") return "Privacy consent"
  if (pathname === "/employees/directory") return "Employee directory"
  if (pathname === "/employees/onboarding") return "New employee onboarding"
  if (pathname.startsWith("/employees/") && pathname !== "/employees/directory") {
    return "Employee profile"
  }
  if (pathname.startsWith("/modules/")) {
    const id = pathname.split("/").pop() ?? "module"
    return id
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }
  if (pathname === "/audit-log") return "Audit log"
  if (pathname.startsWith("/audit-log/")) return "Audit event detail"
  if (pathname === "/login") return "Sign in"
  if (pathname === "/pricing") return "Pricing"
  if (pathname === "/") return "Landing"
  return pathname
}
