import { Briefcase, CalendarRange } from "lucide-react"
import { ProfileField, ProfileFieldGrid } from "./EmployeeProfileFields"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeeJobTabProps {
  employment: {
    department: string
    position: string
    managerName?: string
    officeBranch: string
    hireDate: string
    probationEndDate?: string
    contractStartDate?: string
    contractEndDate?: string
    status: string
  }
}

export function EmployeeJobTab({ employment }: EmployeeJobTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Role & team" icon={Briefcase}>
        <ProfileFieldGrid>
          <ProfileField label="Status" value={employment.status} />
          <ProfileField label="Department" value={employment.department} />
          <ProfileField label="Position" value={employment.position} />
          <ProfileField label="Manager" value={employment.managerName} />
          <ProfileField label="Office branch" value={employment.officeBranch} />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Employment dates" icon={CalendarRange}>
        <ProfileFieldGrid>
          <ProfileField label="Hire date" value={employment.hireDate} />
          <ProfileField label="Probation end" value={employment.probationEndDate} />
          <ProfileField label="Contract start" value={employment.contractStartDate} />
          <ProfileField label="Contract end" value={employment.contractEndDate} />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
