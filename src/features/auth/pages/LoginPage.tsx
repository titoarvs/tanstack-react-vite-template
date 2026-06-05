import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import {
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react"
import { useState, type FormEvent } from "react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { resolvePostLoginNavigation } from "@/features/employee-welcome/lib/profileOnboardingPolicy"
import { RoleBadge } from "../components/RoleBadge"
import { DEMO_CREDENTIALS, DEMO_PICKER_ENTRIES } from "../mockUsers"
import { getSession } from "../authStorage"
import { useAuth } from "../useAuth"

function LoginLeftPanel({
  selectedEmail,
  onSelect,
}: DemoAccountPickerProps) {
  return (
    <aside className="relative hidden min-h-0 max-h-[100dvh] flex-col bg-brand-surface text-brand-surface-fg lg:flex lg:overflow-hidden">
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 p-6 xl:p-8">
          <Link
            to="/"
            className="inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-tito-green"
          >
            <TitoLogo size="lg" variant="onDark" />
          </Link>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-surface-fg/15 bg-brand-surface-fg/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-surface-fg/80">
            <Sparkles className="h-3.5 w-3.5 text-tito-green" />
            HR workspace
          </p>
          <h1 className="mt-4 text-2xl font-bold leading-[1.15] tracking-tight text-brand-surface-fg xl:text-3xl">
            People operations, simplified.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-surface-fg/75 xl:text-base">
            Choose a demo persona below, then sign in on the right.
          </p>
        </div>

        <div className="scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 xl:px-8 xl:pb-8">
          <DemoAccountPicker
            selectedEmail={selectedEmail}
            onSelect={onSelect}
            variant="brand"
          />
          <p className="mt-6 text-xs text-brand-surface-fg/50">
            TitoHRIS · Phase 1 preview
          </p>
        </div>
      </div>
    </aside>
  )
}

function LoginMobileHero() {
  return (
    <div className="relative shrink-0 overflow-hidden bg-brand-surface px-4 py-5 text-brand-surface-fg sm:px-6 lg:hidden">
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
      </div>
    </div>
  )
}

interface DemoAccountPickerProps {
  selectedEmail: string
  onSelect: (email: string) => void
}

function DemoAccountRow({
  entry,
  selected,
  onSelect,
  variant = "default",
}: {
  entry: (typeof DEMO_PICKER_ENTRIES)[number]
  selected: boolean
  onSelect: (email: string) => void
  variant?: "default" | "brand"
}) {
  const isBrand = variant === "brand"

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.email)}
      aria-pressed={selected}
      className={cn(
        "relative z-10 flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all sm:gap-4 sm:px-4",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isBrand
          ? selected
            ? "border-tito-green/50 bg-brand-surface-fg/10 shadow-sm ring-1 ring-tito-green/30"
            : "border-brand-surface-fg/15 bg-brand-surface-fg/5 hover:border-tito-green/30 hover:bg-brand-surface-fg/10"
          : selected
            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/15"
            : "border-border/70 bg-background hover:border-primary/25 hover:bg-muted/35"
      )}
    >
      <RoleBadge role={entry.role} className="hidden shrink-0 sm:inline-flex" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span
            className={cn(
              "text-sm font-semibold",
              isBrand ? "text-brand-surface-fg" : "text-foreground"
            )}
          >
            {entry.label}
          </span>
          <RoleBadge role={entry.role} className="sm:hidden" />
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-xs",
            isBrand ? "text-brand-surface-fg/70" : "text-muted-foreground"
          )}
        >
          {entry.name}
          <span className="mx-1.5 text-border">·</span>
          <span className="font-mono">{entry.email}</span>
        </p>
        <p
          className={cn(
            "mt-1 hidden text-xs leading-relaxed md:block",
            isBrand ? "text-brand-surface-fg/60" : "text-muted-foreground"
          )}
        >
          {entry.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {selected ? (
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full",
              isBrand
                ? "bg-tito-green text-brand-surface"
                : "bg-primary text-primary-foreground"
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Selected</span>
          </span>
        ) : (
          <ChevronRight
            className={cn(
              "h-4 w-4",
              isBrand ? "text-brand-surface-fg/50" : "text-muted-foreground/70"
            )}
            aria-hidden
          />
        )}
      </div>
    </button>
  )
}

function DemoAccountPicker({
  selectedEmail,
  onSelect,
  variant = "default",
  className,
}: DemoAccountPickerProps & {
  variant?: "default" | "brand"
  className?: string
}) {
  const isBrand = variant === "brand"

  return (
    <section
      aria-labelledby="demo-access-heading"
      className={cn("w-full", className)}
    >
      <div
        className={cn(
          "flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
          isBrand ? "border-brand-surface-fg/15" : "border-border/80"
        )}
      >
        <div className="min-w-0 space-y-1">
          <h3
            id="demo-access-heading"
            className={cn(
              "text-base font-semibold",
              isBrand ? "text-brand-surface-fg" : "text-foreground"
            )}
          >
            Demo access
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isBrand ? "text-brand-surface-fg/70" : "text-muted-foreground"
            )}
          >
            Pick a persona to autofill credentials, then continue to the
            workspace.
          </p>
        </div>
        <div
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs",
            isBrand
              ? "border-brand-surface-fg/15 bg-brand-surface-fg/5"
              : "border-border bg-muted/40"
          )}
        >
          <span className={isBrand ? "text-brand-surface-fg/70" : "text-muted-foreground"}>
            Shared password
          </span>
          <code
            className={cn(
              "font-mono font-semibold",
              isBrand ? "text-brand-surface-fg" : "text-foreground"
            )}
          >
            {DEMO_CREDENTIALS.password}
          </code>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {DEMO_PICKER_ENTRIES.map(entry => (
          <li key={entry.id}>
            <DemoAccountRow
              entry={entry}
              selected={
                selectedEmail.toLowerCase() === entry.email.toLowerCase()
              }
              onSelect={onSelect}
              variant={variant}
            />
          </li>
        ))}
      </ul>
    </section>
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

    navigate(resolvePostLoginNavigation(getSession(), redirectParam))
  }

  function fillDemoAccount(selectedEmail: string) {
    const account = DEMO_PICKER_ENTRIES.find(
      entry => entry.email.toLowerCase() === selectedEmail.toLowerCase()
    )
    if (!account) return
    setEmail(account.email)
    setPassword(account.password)
    setError(null)
  }

  return (
    <div className="grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
      <LoginLeftPanel selectedEmail={email} onSelect={fillDemoAccount} />

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

        <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:border-transparent lg:bg-transparent lg:px-8 lg:py-4 xl:px-12">
          <Link
            to="/"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <TitoLogo size="md" />
          </Link>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-9 px-2.5 sm:px-3"
            >
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-9 px-2.5 sm:px-3"
            >
              <Link to="/">Home</Link>
            </Button>
          </nav>
        </header>

        <main className="relative z-10 flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:max-w-3xl lg:px-8 lg:py-10 xl:max-w-4xl xl:px-12">
            <div className="mx-auto w-full max-w-[420px]">
              <div className="mb-6 text-center lg:mb-8 lg:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Sign in to continue to your TitoHRIS workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-lg shadow-black/[0.04] sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
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
              </div>
            </div>

            <div className="mx-auto mt-8 w-full max-w-2xl lg:hidden">
              <DemoAccountPicker
                selectedEmail={email}
                onSelect={fillDemoAccount}
              />
            </div>

            <p className="mx-auto mt-8 w-full max-w-2xl pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-xs leading-relaxed text-muted-foreground lg:max-w-[420px]">
              By signing in you agree to the mock preview terms. Data resets on
              refresh.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
