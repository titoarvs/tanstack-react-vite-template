---
title: TanStack React + Vite
description: The default Vite + React starter, utilizing `Caddy` to serve the built app
tags:
  - node
  - vite
  - react
  - typescript
  - tanstack
---

# TanStack React + Vite Template

This is a lightweight React starter template using [Vite](https://vitejs.dev), [TypeScript](https://www.typescriptlang.org/) with React, and 2 core packages from the TanStack:

1. [TanStack Query](https://tanstack.com/query/latest)
2. [TanStack Router](https://tanstack.com/router/v1)

It is deployed with the memory efficient [Caddy](https://caddyserver.com/) web server, and can be set up on [Railway](https://railway.app) in a single click.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/EF4fed?referralCode=1Apk1r)

## UI stack

- [shadcn/ui](https://ui.shadcn.com) components in `src/components/ui/` (Button, Input, Select, Form, Card, Dialog, etc.)
- [Zod](https://zod.dev) schemas in `src/features/onboarding/schemas/onboardingSchema.ts`
- Forms use `react-hook-form` + `@hookform/resolvers/zod` (`zodResolver`)

Add more shadcn components: `npx shadcn@latest add <component>`

## TitoHRIS (Phase 1)

Phase 1 includes:

- **SaaS subscriptions** — per-seat Starter / Growth / Enterprise plans, 14-day Growth trial, mock checkout & billing ([`src/features/billing/`](src/features/billing/))
- **Dashboard** — workforce KPIs, headcount charts, activity feed (mock + live employee metrics)
- **Employee directory** — TitoHRIS shell, search/filter, employee cards
- **Onboarding** — admin hub with status table, HR draft wizard, employee welcome ([docs/onboarding-flow.md](docs/onboarding-flow.md))
- **Employee details** — read-only profile from card menu

### Mock data

Employee records live in an **in-memory store** ([`src/lib/mock/employeeStore.ts`](src/lib/mock/employeeStore.ts)). Data is seeded on load and **resets when you refresh the page**. The API layer ([`src/features/employees/api/employeeApi.ts`](src/features/employees/api/employeeApi.ts)) is the single swap point for a real backend later.

### Routes

| Path | Screen |
|------|--------|
| `/` | Landing page |
| `/pricing` | Public plan comparison |
| `/login` | Mock sign-in |
| `/billing` | Organization subscription (HR Admin / Admin) |
| `/checkout` | Mock plan checkout |
| `/audit-log` | Activity audit trail table (Administrator, Enterprise plan) |
| `/audit-log/:entryId` | Single audit event detail |
| `/dashboard` | HR dashboard (protected) |
| `/employees/directory` | Employee directory |
| `/employees/onboarding` | Onboarding hub + status table + HR wizard (HR Admin / Admin only) |
| `/employees/:id` | Employee detail |
| `/settings` | Account, appearance & theme |
| `/modules/:id` | Static module placeholders (role-gated sidebar links) |

**Sidebar (per role):** [`sidebarNavConfig.ts`](src/components/layout/sidebarNavConfig.ts) groups items into Main, Workforce, Time & attendance, Pay & documents, Governance (HR/Admin), and Support. Static entries show a **Soon** badge and open a coming-soon page. Implemented routes (dashboard, employees, onboarding, settings) work as before.

| Role | Sidebar highlights |
|------|-------------------|
| Employee | My employment, time off, attendance, payslips, documents, inbox, help |
| Manager | Employees, my team, leave approvals, attendance, time off, reports |
| HR Admin | Onboarding, recruitment, leave management, payroll, compliance, reports |
| Admin | HR items plus users & access, audit log |

### Users & roles (mock RBAC)

Signed-in **users** (`AuthUser` in [`src/features/auth/types.ts`](src/features/auth/types.ts)) are separate from **employee** HR records. Roles: `employee`, `manager`, `hr_admin`, `admin`.

| Role | Demo email | Linked `employeeId` |
|------|------------|---------------------|
| Employee | `employee@titohris.com` | `1` (Angela) |
| Manager | `manager@titohris.com` | `2` (Budi) |
| HR Admin | `hr@titohris.com` | `3` (Citra) |
| Administrator | `admin@titohris.com` | — |

Password for all demo accounts: **`titohris`**. HR-created employees can sign in with their **work email** (provisioned on create). Any other email with password ≥ 4 characters signs in as **employee** without a linked profile unless provisioned.

**Employees** (`employee` role) can open **only their own** employment profile (`employees.view_own`). The company directory and other people’s records are not available; `/employees/directory` redirects to `/employees/{theirId}`.

**Two layers:**

1. **Capabilities** — [`permissions.ts`](src/features/auth/permissions.ts) + `useAuth().can(permission)`
2. **Record scope** — [`accessPolicy.ts`](src/features/auth/accessPolicy.ts) for profile tabs (e.g. Pay Info on self, direct reports, or HR)

#### Role matrix

| Capability | Employee | Manager | HR Admin | Admin |
|------------|:--------:|:-------:|:--------:|:-----:|
| Dashboard | Yes | Yes | Yes | Yes |
| Employee directory (all staff) | No | Yes | Yes | Yes |
| Own employment record | Yes | Yes | Yes | Yes |
| Onboarding / create | No | No | Yes | Yes |
| Delete employee | No | No | Yes | Yes |
| Pay Info (others) | No | Direct reports only | Yes | Yes |
| Pay Info (own profile) | Yes | Yes | Yes | Yes |
| Performance (others) | No | Direct reports only | Yes | Yes |
| Request a change | Own profile | Own profile | Own profile | Own profile |
| Settings (appearance) | Yes | Yes | Yes | Yes |
| User management (future) | No | No | No | Yes |
| Billing / change plan | No | No | Yes | Yes |

**Subscriptions:** Each organization has a plan stored in `localStorage` (`titohris-org-subscriptions`). Demo accounts (`@titohris.com`) use **Enterprise** active. Other sign-ins get a **14-day Growth trial**. Seat limits enforce employee creation; premium sidebar modules (payroll, etc.) require plan features.

**Audit log:** [`src/features/audit/`](src/features/audit/) records navigation, auth, employee, billing, and settings events per organization in `localStorage` (`titohris-audit-log`). Open **Audit log** as `admin@titohris.com` after using the app to see the trail.

**Profile tabs:** Employees only see their **own** record (all tabs including Pay Info). Managers see the full directory; on colleagues they see Personal, Job, and Time Off only, with Pay Info and Performance on **direct reports** (e.g. Jessica Lim `EMP-010` → `managerId: "2"` for Budi).

**Enforcement:** Route `beforeLoad` in [`routeGuards.ts`](src/features/auth/routeGuards.ts); sidebar nav filtered by permission; [`employeeApi.ts`](src/features/employees/api/employeeApi.ts) throws `ForbiddenError` on create/delete/pay without rights. Session: `localStorage` key `titohris-auth-session`.

**Dashboard (per role):** [`DashboardPage.tsx`](src/features/dashboard/pages/DashboardPage.tsx) renders a different layout by role — **Employee:** personal attendance, leave balances, link to own profile; **Manager:** direct reports, team leave approvals, team list; **HR Admin / Admin:** org-wide headcount, department charts, onboarding quick actions.

**Onboarding flows:** See [docs/onboarding-flow.md](docs/onboarding-flow.md) for the hub, status table (all employees + drafts), HR wizard, work-email login handoff, and Phase 2 roadmap.

**New employee welcome (`/welcome`):** When HR adds someone (`profileOnboardingComplete: false`), the employee must finish a 3-step setup (contact, policies, review) before the dashboard. Demo new hire: `newhire@titohris.com` / `titohris` (linked to `EMP-011`). Existing demo employee `employee@titohris.com` skips welcome. Optional fields: address, DOB, emergency contact, preferred name, personal email, photo.

### Themes

Four workspace themes are configured in [`src/config/themes.ts`](src/config/themes.ts):

| Theme | ID | Description |
|-------|-----|-------------|
| Light | `light` | Default neutral workspace |
| Dark | `dark` | Grayscale dark mode |
| Tito Light | `tito` | Brand-forward light surfaces |
| Tito Dark | `tito-dark` | Deep navy with Tito accents |

Preference is stored in `localStorage` (`titohris-theme`) and applied via `data-theme` on `<html>`. Add new themes by extending the config and CSS variable blocks in [`src/index.css`](src/index.css).

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Typecheck: `npm run typecheck`
4. Build: `npm run build`

## Deploying to Vercel

This app is a client-side SPA (TanStack Router). Vercel must serve `index.html` for deep routes so refresh and direct URL access work.

**Project settings:**

| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Framework Preset | Vite (or Other) |

**SPA fallback:** [`vercel.json`](vercel.json) rewrites extensionless paths to `/index.html` while leaving `/assets/*` and other static files untouched.

After deploy, verify hard refresh on `/dashboard` and direct navigation to `/employees/directory` — both should load the app, not Vercel's NOT_FOUND page.

## ❓ Why `Caddy` for serving the app?

See: https://github.com/brody192/vite-react-template#-why-use-caddy-when-deploying-to-railway

> Caddy is a powerful, enterprise-ready, open source web server, and therefore Caddy is far better suited to serve websites than Vite is, using Caddy will result in much less memory and cpu usage compared to serving with Vite (much lower running costs too).
