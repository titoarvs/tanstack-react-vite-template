# Employee onboarding (TitoHRIS)

This document describes onboarding flows and how they map to the **EDM field model**. For EDM tab/RBAC details see [edm-field-matrix.md](./edm-field-matrix.md).

## Overview

Onboarding has **three connected paths**:

1. **Pre-employment invite (primary)** — HR sends a link; candidate completes forms **before** any employee record or HRIS access exists.
2. **Express hire** — HR creates an employee directly at `/employees/onboarding` when data was collected offline; hire completes `/welcome` before HRIS.
3. **Employee welcome** — Provisioned employees finish first-day compliance (and residual profile fields for express hire) at `/welcome` before the app shell unlocks.

**Mock constraints:**

- Employee records live in [`employeeStore.ts`](../src/lib/mock/employeeStore.ts); pre-employment invites in [`preEmploymentStore.ts`](../src/lib/mock/preEmploymentStore.ts). Data resets on page refresh.
- Auth users (`AuthUser`) and HR records (`Employee`) are separate until mock provisioning links them.
- Session is stored in `localStorage` (`titohris-auth-session`).

## Pre-employment flow (primary)

| Step | Actor | Route | Outcome |
|------|-------|-------|---------|
| 1 | HR | `/employees/pre-employment` | Creates invite + copy link `/join/{token}` |
| 2 | Candidate | `/join/{token}` | 6-step wizard; progressive save; submit |
| 3 | Candidate | `/join/{token}/submitted` | Waiting screen — no HRIS access |
| 4 | HR | `/employees/pre-employment/{inviteId}` | Review uploads + contract signatures; countersign; approve |
| 5 | System | — | Creates employee (`status: onboarding`), maps documents, provisions login |
| 6 | Employee | `/login` → `/welcome` | First-day compliance (NDA, AUP, privacy) then HRIS |

**Demo invite:** `/join/demo-token` (candidate: Alex Rivera, full-time onsite)

**HR invite fields:** email, name, intended department/position/hire date, **employment type**, **work location**, optional **academic internship** flag

**Candidate portal steps:** Contact → Emergency → **Documents** → **Contracts (e-sign)** → Policies & photo → Review

**Document requirements** are driven by [`documentRequirementPolicy.ts`](../src/features/employees/lib/documentRequirementPolicy.ts) using employment type, work location, marital status, and academic-intern flags.

| Timing | Collected in | Examples |
|--------|--------------|----------|
| Pre-employment uploads | Candidate Documents step | Valid ID (×2 part-time), NBI (full-time), medical, gov forms before start |
| Contract signing | Candidate Contracts step | Job offer, employment contract, MOA (academic intern) |
| HR countersign | HR review | Verify candidate signatures; countersign each contract |
| First day | `/welcome` compliance step | NDA, non-compete, AUP, privacy consent |

## Express hire (`/employees/onboarding`)

**Steps:** Personal → Employment → Review

**HR fields only:** employee ID, name, demographics, work email, employment master data

**On submit:** `status: onboarding`, `profileOnboardingComplete: false`, mock portal provisioning

## Employee welcome (`/welcome`)

**When required:** All `onboarding` employees until first-day compliance is complete

**Pre-employment hires:** Slim path — compliance + review only (contact already captured in portal)

**Express hire:** Contact → policies → compliance → review

**On submit:** Updates compliance timestamps; sets `status: active`, `profileOnboardingComplete: true`

## Pre-Day 0 field split (EDM)

| Flow | Collects | Authority |
|------|----------|-----------|
| HR invite / express hire | Employee ID, name, demographics, work email, employment master data | HRIS Admin+ |
| Pre-employment portal | Phone, address, documents, contract e-sign, handbook, photo | Candidate self-service |
| Employee welcome | First-day NDA / non-compete / AUP / privacy; residual contact for express hire | Employee self-service |

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
| Document requirements | `src/features/employees/lib/documentRequirementPolicy.ts` |
| EDM policy | `src/features/employees/edm/` |
| Express hire wizard | `src/features/onboarding/` |
| Employee welcome | `src/features/employee-welcome/` |
| Profile tabs | `src/features/employees/components/detail/edm/` |
| Permissions | `src/features/auth/permissions.ts` |
