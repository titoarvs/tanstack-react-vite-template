import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import {
  ArrowRight,
  BarChart3,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  Users,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getPostLoginPath } from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { DEMO_ACCOUNTS, DEMO_CREDENTIALS } from "../mockUsers"
import { getRoleLabel, ROLE_DESCRIPTIONS } from "../roles"
import type { UserRole } from "../types"
import { getSession } from "../authStorage"
import { useAuth } from "../useAuth"

const highlights = [
  { icon: Users, label: "Employee directory & onboarding" },
  { icon: BarChart3, label: "People analytics dashboard" },
  { icon: Sparkles, label: "14-day trial · per-seat SaaS" },
] as const

function LoginBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-brand-surface text-brand-surface-fg lg:flex lg:flex-col">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in oklch, var(--tito-green) 40%, transparent) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 90%, color-mix(in oklch, var(--tito-dull-blue) 55%, transparent) 0%, transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--brand-surface-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--brand-surface-fg) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-8 xl:p-12">
        <div>
          <Link
            to="/"
            className="inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-tito-green"
          >
            <TitoLogo size="lg" variant="onDark" />
          </Link>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-surface-fg/15 bg-brand-surface-fg/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-surface-fg/80">
            <Sparkles className="h-3.5 w-3.5 text-tito-green" />
            HR workspace
          </p>
          <h1 className="mt-5 max-w-sm text-3xl font-bold leading-[1.15] tracking-tight text-brand-surface-fg xl:text-4xl">
            People operations, simplified.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-brand-surface-fg/75">
            One place for employee records, guided onboarding, and the workflows your HR
            team uses every day.
          </p>
        </div>

        <ul className="mt-8 space-y-2.5">
          {highlights.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border border-brand-surface-fg/10 bg-brand-surface-fg/5 px-4 py-3 text-sm text-brand-surface-fg/90"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tito-green/20 text-tito-green">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-8 shrink-0 text-xs text-brand-surface-fg/50">
          TitoHRIS · Phase 1 preview
        </p>
      </div>
    </aside>
  )
}

function LoginMobileHero() {
  return (
    <div className="relative shrink-0 overflow-hidden bg-brand-surface px-4 py-6 text-brand-surface-fg sm:px-6 lg:hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--tito-green) 35%, transparent) 0%, transparent 50%)",
        }}
      />
      <div className="relative">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-surface-fg/70">
          <Sparkles className="h-3 w-3 text-tito-green" />
          TitoHRIS
        </p>
        <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
          Sign in to your workspace
        </h1>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-brand-surface-fg/75">
          Employee records, onboarding, and role-based dashboards in one place.
        </p>
      </div>
    </div>
  )
}

interface DemoAccountPickerProps {
  onSelect: (role: UserRole) => void
}

function DemoAccountPicker({ onSelect }: DemoAccountPickerProps) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/25 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Demo access
        </p>
        <p className="text-xs text-muted-foreground">
          Password:{" "}
          <span className="font-mono font-medium text-foreground">
            {DEMO_CREDENTIALS.password}
          </span>
        </p>
      </div>

      {/* Compact role chips — phones & narrow widths */}
      <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
        {DEMO_ACCOUNTS.map(account => (
          <button
            key={account.email}
            type="button"
            onClick={() => onSelect(account.user.role)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/60 active:scale-[0.98]"
          >
            {getRoleLabel(account.user.role)}
          </button>
        ))}
      </div>

      {/* Card grid — tablet+ */}
      <ul className="mt-3 hidden gap-2 sm:grid sm:grid-cols-2">
        {DEMO_ACCOUNTS.map(account => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => onSelect(account.user.role)}
              className={cn(
                "flex h-full w-full flex-col rounded-lg border border-border/80 bg-background px-3 py-2.5 text-left transition-colors",
                "hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="text-sm font-medium text-foreground">
                {getRoleLabel(account.user.role)}
              </span>
              <span className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                {account.email}
              </span>
              <span className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {ROLE_DESCRIPTIONS[account.user.role]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { redirect?: string }
  const { login } = useAuth()
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.password)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    const redirectParam =
      typeof search.redirect === "string" && search.redirect.startsWith("/")
        ? search.redirect
        : undefined

    navigate({ to: getPostLoginPath(getSession(), redirectParam) })
  }

  function fillDemoAccount(role?: UserRole) {
    const account =
      role != null
        ? DEMO_ACCOUNTS.find(a => a.user.role === role)
        : DEMO_ACCOUNTS.find(a => a.email === DEMO_CREDENTIALS.email)
    if (!account) return
    setEmail(account.email)
    setPassword(account.password)
    setError(null)
  }

  return (
    <div className="grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
      <LoginBrandPanel />

      <div className="relative flex min-h-[100dvh] min-w-0 flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] lg:opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 8%, color-mix(in oklch, var(--tito-green) 16%, transparent) 0%, transparent 42%), radial-gradient(circle at 8% 92%, color-mix(in oklch, var(--tito-dull-blue) 10%, transparent) 0%, transparent 38%)",
          }}
        />

        <LoginMobileHero />

        <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:border-transparent lg:bg-transparent lg:px-10 lg:py-5">
          <Link
            to="/"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <TitoLogo size="md" />
          </Link>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="h-9 px-2.5 sm:px-3">
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-9 px-2.5 sm:px-3">
              <Link to="/">Home</Link>
            </Button>
          </nav>
        </header>

        <main className="relative z-10 flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-16">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-6 lg:mb-8">
                <h2 className="hidden text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:block">
                  Welcome back
                </h2>
                <p className="mt-0 hidden text-sm leading-relaxed text-muted-foreground sm:text-base lg:block lg:mt-2">
                  Sign in to continue to your TitoHRIS workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-lg shadow-black/[0.04] sm:p-7 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password">Password</Label>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Mock
                      </span>
                    </div>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="h-11 w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Continue to workspace
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <DemoAccountPicker onSelect={fillDemoAccount} />
              </div>

              <p className="mt-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-xs leading-relaxed text-muted-foreground">
                By signing in you agree to the mock preview terms. Data resets on refresh.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
