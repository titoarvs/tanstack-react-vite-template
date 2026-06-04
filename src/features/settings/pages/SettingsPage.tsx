import { Link } from "@tanstack/react-router"
import { PageContent } from "@/components/layout/PageContent"
import { PageHeader } from "@/components/layout/PageHeader"
import { RoleBadge } from "@/features/auth/components/RoleBadge"
import { PERMISSIONS } from "@/features/auth/permissions"
import { ROLE_DESCRIPTIONS } from "@/features/auth/roles"
import { useAuth } from "@/features/auth/useAuth"
import { SeatUsageMeter } from "@/features/billing/components/SeatUsageMeter"
import { getPlan } from "@/features/billing/plans"
import { subscriptionStatusLabel } from "@/features/billing/subscriptionPolicy"
import { useBilling } from "@/features/billing/useBilling"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { themeDefinitions } from "@/config/themes"
import { ThemeSelector } from "../components/ThemeSelector"
import { useTheme } from "../useTheme"

export function SettingsPage() {
  const { user, can } = useAuth()
  const showHrSettings = can(PERMISSIONS.SETTINGS_VIEW)
  const canManageBilling = can(PERMISSIONS.BILLING_MANAGE)
  const { subscription, organizationName, seatCount, trialDaysRemaining, isLoading } =
    useBilling()
  const { themeId } = useTheme()
  const activeTheme = themeDefinitions.find(theme => theme.id === themeId)

  return (
    <PageContent className="max-w-3xl">
      <PageHeader title="Settings" />

      {user && (
        <Card className="mb-6 border-border/80">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Signed-in user and role (mock session — stored in this browser).
            </p>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{user.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-foreground">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="mt-1">
                  <RoleBadge role={user.role} />
                </dd>
              </div>
              {user.employeeId && (
                <div>
                  <dt className="text-muted-foreground">Linked employee ID</dt>
                  <dd className="font-mono text-foreground">{user.employeeId}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">
              {ROLE_DESCRIPTIONS[user.role]}
            </p>
            {!showHrSettings && (
              <p className="mt-2 text-xs text-muted-foreground">
                Appearance settings are available below. HR workspace settings require an HR
                Admin or Administrator role.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {subscription && !isLoading && (
        <Card className="mb-6 border-border/80">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Subscription
              </CardTitle>
              <Badge variant="secondary">
                {subscriptionStatusLabel(subscription.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {organizationName} · {getPlan(subscription.planId).name} plan
              {trialDaysRemaining != null &&
                subscription.status === "trialing" &&
                ` · ${trialDaysRemaining} trial days left`}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <SeatUsageMeter used={seatCount} limit={subscription.seatLimit} />
            {canManageBilling && (
              <Button asChild variant="secondary" size="sm">
                <Link to="/billing">Manage billing</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Appearance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a workspace theme. Your preference is saved locally in this browser.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemeSelector />
          <Separator />
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Active theme</dt>
              <dd className="font-medium text-foreground">{activeTheme?.label ?? themeId}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Color mode</dt>
              <dd className="font-medium capitalize text-foreground">
                {activeTheme?.mode ?? "light"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </PageContent>
  )
}
