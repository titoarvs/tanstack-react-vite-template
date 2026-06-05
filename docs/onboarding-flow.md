# Employee onboarding (TitoHRIS)

This document describes the onboarding flows and how they map to the **EDM field model**. For EDM tab/RBAC details see [edm-field-matrix.md](./edm-field-matrix.md).

## Overview

Onboarding is **two connected flows**:

1. **HR wizard** — HRIS Admin or SuperAdmin creates employees at `/employees/onboarding` (3-step wizard).
2. **Employee welcome** — After HR create, the hire signs in with their **work email** (mock-provisioned) and completes `/welcome` before the app shell.

**Mock constraints:**

- Employee records live in [`employeeStore.ts`](../src/lib/mock/employeeStore.ts); data resets on page refresh.
- Auth users (`AuthUser`) and HR records (`Employee`) are separate until mock provisioning links them.
- Session is stored in `localStorage` (`titohris-auth-session`).

## Pre-Day 0 field split (EDM)

| Flow | Collects | Authority |
|------|----------|-----------|
| HR wizard | Employee ID, name, demographics, contact, employment master data | HRIS Admin+ |
| Employee welcome | Phone, address, province, emergency contact, preferred name, photo, privacy compliance | Employee self-service |

Restricted fields (gov IDs, compensation, documents, system access) are **not** collected in onboarding—they appear on the employment profile when authorized roles populate them.

## HR wizard (`/employees/onboarding`)

**Steps:** Personal → Employment → Review

**Personal fields:** `employeeId`, `firstName`, `middleName`, `lastName`, `suffix`, demographics, `email`, `phone`, `address`, `province`, `photoUrl`

**Employment fields:** `department`, `position` (master lists), `managerId`, `orgLevel`, `workLocation`, `employmentType`, `hireDate`, probation/contract dates, `officeBranch`

**On submit:** `createEmployee()` with `status: active`, `profileOnboardingComplete: false`, mock portal provisioning.

## Employee welcome (`/welcome`)

**On submit:** Updates contact, emergency contact, preferred name, photo, and maps policy acknowledgements to `compliance.privacyConsentSigned` / `dataSubjectAccessSigned`.

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
| EDM policy | `src/features/employees/edm/` |
| HR wizard | `src/features/onboarding/` |
| Employee welcome | `src/features/employee-welcome/` |
| Profile tabs | `src/features/employees/components/detail/edm/` |
| Permissions | `src/features/auth/permissions.ts` |
