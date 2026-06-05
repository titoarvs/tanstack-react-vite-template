# Employee onboarding (TitoHRIS)

This document describes onboarding flows and how they map to the **EDM field model**. For EDM tab/RBAC details see [edm-field-matrix.md](./edm-field-matrix.md).

## Overview

Onboarding has **three connected paths**:

1. **Pre-employment invite (primary)** — HR sends a link; candidate completes forms **before** any employee record or HRIS access exists.
2. **Express hire** — HR creates an employee directly at `/employees/onboarding` when data was collected offline; hire completes `/welcome` before HRIS.
3. **Employee welcome** — Provisioned employees finish self-service fields at `/welcome` before the app shell unlocks.

**Mock constraints:**

- Employee records live in [`employeeStore.ts`](../src/lib/mock/employeeStore.ts); pre-employment invites in [`preEmploymentStore.ts`](../src/lib/mock/preEmploymentStore.ts). Data resets on page refresh.
- Auth users (`AuthUser`) and HR records (`Employee`) are separate until mock provisioning links them.
- Session is stored in `localStorage` (`titohris-auth-session`).

## Pre-employment flow (primary)

| Step | Actor | Route | Outcome |
|------|-------|-------|---------|
| 1 | HR | `/employees/pre-employment` | Creates invite + copy link `/join/{token}` |
| 2 | Candidate | `/join/{token}` | 4-step wizard; progressive save; submit |
| 3 | Candidate | `/join/{token}/submitted` | Waiting screen — no HRIS access |
| 4 | HR | `/employees/pre-employment/{inviteId}` | Review submission; approve or request changes |
| 5 | System | — | Creates employee, provisions portal login |
| 6 | Employee | `/login` → `/dashboard` | HRIS access (welcome skipped when pre-employment captured policies) |

**Demo invite:** `/join/demo-token` (candidate: Alex Rivera)

**HR invite fields:** email, name, intended department/position/hire date

**Candidate portal fields:** phone, address, province, demographics, emergency contact, preferred name, personal email, photo, policy acknowledgements

## Express hire (`/employees/onboarding`)

**Steps:** Personal → Employment → Review

**HR fields only:** employee ID, name, demographics, work email, employment master data

**On submit:** `status: onboarding`, `profileOnboardingComplete: false`, mock portal provisioning

## Employee welcome (`/welcome`)

**When required:** Express-hire employees and legacy demo `newhire@` (`EMP-011`)

**On submit:** Updates contact, emergency contact, preferred name, photo, compliance; sets `status: active`

## Pre-Day 0 field split (EDM)

| Flow | Collects | Authority |
|------|----------|-----------|
| HR invite / express hire | Employee ID, name, demographics, work email, employment master data | HRIS Admin+ |
| Pre-employment portal | Phone, address, province, emergency contact, preferred name, photo, privacy compliance | Candidate self-service |
| Employee welcome | Residual self-service fields not yet captured | Employee self-service |

## Demo accounts (6 EDM roles)

| Role | Login |
|------|-------|
| HRIS SuperAdmin | `superadmin@titohris.com` / `titohris` |
| HRIS Admin | `hr@titohris.com` / `titohris` |
| HRBP | `hrbp@titohris.com` / `titohris` |
| System Admin | `sysadmin@titohris.com` / `titohris` |
| Manager | `manager@titohris.com` / `titohris` |
| Employee | `employee@titohris.com` / `titohris` |
| New hire (welcome pending) | `newhire@titohris.com` / `titohris` |

Legacy alias: `admin@titohris.com` → HRIS SuperAdmin.

## Related code

| Area | Path |
|------|------|
| Pre-employment | `src/features/pre-employment/` |
| EDM policy | `src/features/employees/edm/` |
| Express hire wizard | `src/features/onboarding/` |
| Employee welcome | `src/features/employee-welcome/` |
| Profile tabs | `src/features/employees/components/detail/edm/` |
| Permissions | `src/features/auth/permissions.ts` |
