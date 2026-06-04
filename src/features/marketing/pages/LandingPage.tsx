import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BarChart3,
  Clock,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { TitoLogo } from "@/components/branding/TitoLogo"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Users,
    title: "Employee directory",
    description:
      "Search, filter, and manage your workforce in grid or list views with role-aware actions.",
  },
  {
    icon: Sparkles,
    title: "Guided onboarding",
    description:
      "Three-step flows capture personal details, employment info, and review before go-live.",
  },
  {
    icon: Clock,
    title: "Time & attendance",
    description:
      "Track schedules and attendance patterns from a single organisation hub.",
  },
  {
    icon: BarChart3,
    title: "People analytics",
    description:
      "Surface headcount trends, department mix, and hiring velocity at a glance.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "Role-based access and audit-ready records built for growing HR teams.",
  },
]

export function LandingPage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--tito-green) 25%, transparent) 0%, transparent 45%), radial-gradient(circle at 80% 0%, color-mix(in oklch, var(--tito-dull-blue) 30%, transparent) 0%, transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--tito-blue) 1px, transparent 1px), linear-gradient(to bottom, var(--tito-blue) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TitoLogo size="md" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <a href="#features">Features</a>
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/pricing">Pricing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-14 lg:px-8 lg:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-tito-green/30 bg-tito-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-tito-dark-green">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 1 preview
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-tito-blue sm:text-5xl lg:text-6xl">
              HR operations,{" "}
              <span className="bg-gradient-to-r from-tito-green to-tito-dull-green bg-clip-text text-transparent">
                unified
              </span>{" "}
              for modern teams
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              TitoHRIS brings employee records, onboarding, and organisation
              tools into one responsive workspace — designed for people teams
              who move fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild className="h-11 px-6">
                <Link to="/login">
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-11">
                <Link to="/login" search={{ redirect: "/dashboard" }}>
                  View demo
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:max-w-md">
              <div>
                <dt className="text-2xl font-bold text-tito-blue">3-step</dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">
                  Onboarding
                </dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-tito-blue">Live</dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">
                  Directory views
                </dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-tito-blue">Mock</dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">
                  API layer
                </dd>
              </div>
            </dl>
          </div>

          <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-tito-green/20 to-tito-dull-blue/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="border-b border-border bg-tito-blue px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-tito-green" />
                    <span className="h-2.5 w-2.5 rounded-full bg-tito-dull-green/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-tito-dull-blue" />
                    <span className="ml-2 text-xs font-medium text-tito-foreground/80">
                      employees/directory
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-tito-green/30 to-tito-dull-blue/40" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="h-2.5 w-24 rounded-full bg-muted" />
                        <div className="h-2 w-32 rounded-full bg-muted/70" />
                      </div>
                      <div className="h-5 w-14 shrink-0 rounded-full bg-tito-green/15" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-24 scroll-mt-24 sm:mt-32">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-tito-blue sm:text-3xl">
                Simple per-seat pricing
              </h2>
              <p className="mt-3 text-muted-foreground">
                Starter, Growth, and Enterprise plans. Start with a 14-day
                Growth trial when you sign in — upgrade anytime in Billing.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/pricing">Compare all plans</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$6",
                seats: "15 seats",
                note: "Core HR & onboarding",
              },
              {
                name: "Growth",
                price: "$12",
                seats: "75 seats",
                note: "Analytics & payroll preview",
              },
              {
                name: "Enterprise",
                price: "$22",
                seats: "Unlimited",
                note: "Governance & API",
              },
            ].map(tier => (
              <div
                key={tier.name}
                className="rounded-xl border border-border bg-card/80 p-5"
              >
                <h3 className="font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-2xl font-bold text-tito-blue">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / seat / mo
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tier.seats}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mt-24 scroll-mt-24 sm:mt-32">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold text-tito-blue sm:text-3xl">
              Everything your HR team needs to start
            </h2>
            <p className="mt-3 text-muted-foreground">
              Phase 1 focuses on core employee workflows — with room to grow
              into payroll, leave, and analytics.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group rounded-xl border border-border bg-card/80 p-5 transition-colors hover:border-tito-green/40 hover:bg-card"
              >
                <div className="mb-4 inline-flex rounded-lg bg-tito-green/15 p-2.5 text-tito-dark-green transition-colors group-hover:bg-tito-green/25">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 overflow-hidden rounded-2xl dark:border-2 px-6 py-10 text-center sm:px-10 sm:py-14">
          <h2 className="text-2xl font-bold  sm:text-3xl">
            Ready to explore TitoHRIS?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm  sm:text-base">
            Sign in with the demo account or any email — mock auth stores your
            session locally for this preview.
          </p>
          <Button size="lg" asChild className="mt-6">
            <Link to="/login">
              Sign in to workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
        TitoHRIS · Mock preview · Data resets on refresh
      </footer>
    </div>
  )
}
