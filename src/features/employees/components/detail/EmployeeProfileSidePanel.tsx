import { Link } from "@tanstack/react-router"
import {
  Briefcase,
  Building2,
  Hash,
  Mail,
  MapPin,
  Phone,
  UserCircle,
} from "lucide-react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatDisplayDate, formatTenureDetailed } from "../../data/mockEmployeeInsights"
import type { Employee } from "../../types"
import {
  getDisplayName,
  getEmploymentTypeLabel,
  getEmployeeStatusLabel,
  getFullName,
  getWorkLocationLabel,
} from "../../types"

interface EmployeeProfileSidePanelProps {
  employee: Employee
  manager?: Employee
  className?: string
}

export function EmployeeProfileSidePanel({
  employee,
  manager,
  className,
}: EmployeeProfileSidePanelProps) {
  const name = getFullName(employee)
  const displayName = getDisplayName(employee)
  const isActive = employee.status === "active"
  const isOnboarding = employee.status === "onboarding"

  return (
    <aside
      className={cn(
        "scroll-area min-w-0 lg:max-h-full lg:overflow-y-auto lg:overscroll-contain lg:self-start",
        className
      )}
    >
      <Card className="flex flex-col overflow-hidden border-border/80 shadow-sm">
        <div
          className="pointer-events-none h-1 w-full shrink-0 bg-gradient-to-r from-tito-green/80 via-tito-dull-green/60 to-tito-dull-blue/50"
          aria-hidden
        />
        <CardContent className="space-y-5 p-5">
        <div className="flex flex-col items-center text-center">
          <EmployeeAvatar
            src={employee.photoUrl}
            name={name}
            className="h-20 w-20 shadow-md ring-2 ring-border"
          />
          <h1 className="mt-4 text-lg font-bold tracking-tight text-foreground">
            {displayName}
          </h1>
          {employee.preferredName && displayName !== name && (
            <p className="mt-0.5 text-xs text-muted-foreground">Legal: {name}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">{employee.position}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            <Badge variant={isActive ? "active" : isOnboarding ? "secondary" : "inactive"}>
              {getEmployeeStatusLabel(employee.status)}
            </Badge>
            <Badge variant="outline">{getEmploymentTypeLabel(employee.employmentType)}</Badge>
          </div>
        </div>

        <Separator />

        <dl className="space-y-3 text-sm">
          <SideDetail icon={Hash} label="Employee ID" value={employee.employeeId} />
          <SideDetail icon={Building2} label="Department" value={employee.department} />
          <SideDetail
            icon={MapPin}
            label="Location"
            value={getWorkLocationLabel(employee.workLocation)}
          />
          <SideDetail
            icon={Briefcase}
            label="Tenure"
            value={formatTenureDetailed(employee.lifecycle.hireDate)}
            hint={`Since ${formatDisplayDate(employee.lifecycle.hireDate)}`}
          />
        </dl>

        <Separator />

        <div className="space-y-2">
          <SideLink icon={Mail} href={`mailto:${employee.contact.email}`} label={employee.contact.email} />
          <SideLink icon={Phone} href={`tel:${employee.contact.phone}`} label={employee.contact.phone} />
        </div>

        <Separator />

        {manager ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reports to
            </p>
            <Link
              to="/employees/$employeeId"
              params={{ employeeId: manager.id }}
              className="mt-2 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/15 p-3 transition-colors hover:bg-muted/30"
            >
              <EmployeeAvatar
                src={manager.photoUrl}
                name={getFullName(manager)}
                className="h-10 w-10 shrink-0"
              />
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-semibold text-foreground">
                  {getFullName(manager)}
                </p>
                <p className="truncate text-xs text-muted-foreground">{manager.position}</p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2.5 text-xs text-muted-foreground">
            <UserCircle className="h-4 w-4 shrink-0" />
            No manager assigned
          </div>
        )}
      </CardContent>
    </Card>
    </aside>
  )
}

function SideDetail({
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
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 break-words font-semibold text-foreground">{value}</dd>
        {hint && <dd className="mt-0.5 text-xs text-muted-foreground">{hint}</dd>}
      </div>
    </div>
  )
}

function SideLink({
  icon: Icon,
  href,
  label,
}: {
  icon: typeof Mail
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-muted/25"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 truncate">{label}</span>
    </a>
  )
}
