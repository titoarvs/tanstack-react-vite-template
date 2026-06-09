import { Link } from "@tanstack/react-router"
import {
  Briefcase,
  Building2,
  ChevronLeft,
  Hash,
  Mail,
  MapPin,
  Phone,
  UserCircle,
} from "lucide-react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDisplayDate, formatTenureDetailed } from "../../data/mockEmployeeInsights"
import type { Employee } from "../../types"
import { getEmploymentTypeLabel, getFullName, getWorkLocationLabel } from "../../types"

interface EmployeeProfileHeroProps {
  employee: Employee
  manager?: Employee
  backTo: string
  backLabel: string
  className?: string
}

export function EmployeeProfileHero({
  employee,
  manager,
  backTo,
  backLabel,
  className,
}: EmployeeProfileHeroProps) {
  const name = getFullName(employee)
  const isActive = employee.status === "active"

  return (
    <div className={cn("space-y-4", className)}>
      <Link
        to={backTo}
        className="inline-flex w-fit items-center gap-1 rounded-lg px-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <div
          className="pointer-events-none h-1.5 w-full bg-gradient-to-r from-tito-green/80 via-tito-dull-green/60 to-tito-dull-blue/50"
          aria-hidden
        />
        <CardContent className="p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <EmployeeAvatar
              src={employee.photoUrl}
              name={name}
              className="h-20 w-20 shrink-0 shadow-md ring-2 ring-border sm:h-24 sm:w-24"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {name}
                </h1>
                <Badge variant={isActive ? "active" : "inactive"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{getEmploymentTypeLabel(employee.employmentType)}</Badge>
              </div>
              <p className="mt-1 text-base text-muted-foreground">{employee.jobTitle}</p>
              <p className="text-sm text-muted-foreground">
                {employee.department} · {employee.position}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <ContactChip
                  icon={Mail}
                  href={`mailto:${employee.contact.email}`}
                  label={employee.contact.email}
                />
                <ContactChip
                  icon={Phone}
                  href={`tel:${employee.contact.phone}`}
                  label={employee.contact.phone}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <HeroStat
              icon={Hash}
              label="Employee ID"
              value={employee.employeeId}
            />
            <HeroStat icon={Building2} label="Department" value={employee.department} />
            <HeroStat
              icon={MapPin}
              label="Location"
              value={getWorkLocationLabel(employee.workLocation)}
            />
            <HeroStat
              icon={Briefcase}
              label="Tenure"
              value={formatTenureDetailed(employee.lifecycle.hireDate)}
              hint={`Since ${formatDisplayDate(employee.lifecycle.hireDate)}`}
            />
          </div>

          {manager ? (
            <div className="mt-6 rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Reports to
              </p>
              <Link
                to="/employees/$employeeId"
                params={{ employeeId: manager.id }}
                className="mt-3 flex items-center gap-3 rounded-lg transition-colors hover:bg-background/80"
              >
                <EmployeeAvatar
                  src={manager.photoUrl}
                  name={getFullName(manager)}
                  className="h-11 w-11 shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {getFullName(manager)}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{manager.position}</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
              <UserCircle className="h-4 w-4 shrink-0" />
              No manager assigned
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ContactChip({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Mail
  label: string
  href: string
}) {
  return (
    <a
      href={href}
      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-muted/40"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </a>
  )
}

function HeroStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Hash
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 px-4 py-3.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1.5 truncate text-sm font-semibold text-foreground" title={value}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
