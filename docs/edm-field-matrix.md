# EDM Field Matrix (Implementation Reference)

Employee Data Management fields are defined in `src/features/employees/edm/fieldRegistry.ts` with RBAC in `roleMatrix.ts` and enforcement in `fieldPolicy.ts`.

## Profile tabs (7 EDM + 2 legacy)

| Tab | EDM fields |
|-----|------------|
| Personal | employeeId, name, preferredName, photo, demographics, contact, address, emergencyContact |
| Employment | department/position, supervisor, org structure, work location, type, status, lifecycle dates, separation reason |
| Compensation | monthly salary, grade, effective date, HMO (+ payroll history subsection) |
| Government | TIN, SSS, PhilHealth, Pag-IBIG |
| Documents | uploaded files, metadata, onboarding checklist |
| Compliance | privacy consent, data subject access, retention/deletion, audit trail |
| Access & Systems | system access, request status, provision/deprovision dates |
| Time Off | *(legacy mock — outside EDM spec)* |
| Performance | *(legacy mock — outside EDM spec)* |

## Roles

| Slug | Label |
|------|-------|
| `system_admin` | System Admin |
| `hris_super_admin` | HRIS SuperAdmin |
| `hris_admin` | HRIS Admin |
| `hrbp` | HRBP |
| `manager` | Manager |
| `employee` | Employee |

## Verification checklist

1. Sign in as each demo role and open `EMP-001` (Angela) — confirm tab visibility matches matrix.
2. As **manager**, open direct report profile — confirm salary and gov IDs are hidden; name shows limited view.
3. As **employee**, open own profile — confirm compensation, gov IDs, and documents visible.
4. Run policy tests: `npx tsx src/features/employees/edm/fieldPolicy.test.ts`

## Key enforcement points

- API strips fields via `stripEmployeeForViewer()` in `employeeApi.ts`
- UI uses `EdmProfileField` + `useEdmFieldAccess()`
- Managers cannot view payroll history for reports (`canViewPayrollHistory`)
