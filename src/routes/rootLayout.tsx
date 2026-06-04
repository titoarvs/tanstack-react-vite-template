import { Navigate, Outlet } from "@tanstack/react-router"
import * as React from "react"
import { AuthProvider } from "../features/auth/AuthProvider"
import { BillingProvider } from "../features/billing/BillingProvider"
import { ThemeProvider } from "../features/settings/ThemeProvider"

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import("@tanstack/router-devtools").then(res => ({
        default: res.TanStackRouterDevtools,
      }))
    )

export function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BillingProvider>
          <Outlet />
          <React.Suspense fallback={null}>
            <TanStackRouterDevtools />
          </React.Suspense>
        </BillingProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export function IndexRedirect() {
  return <Navigate to="/employees/directory" />
}
