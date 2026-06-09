import { Briefcase, CalendarRange } from "lucide-react"
import { ProfileField, ProfileFieldGrid } from "./EmployeeProfileFields"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeeJobTabProps {
  employment: {
    department: string
    position: string
    jobTitle: string
    isManager: boolean
    managerName?: string
    workLocation: string
    employmentType: string
    status: string
    statusDetail?: string
    hireDate: string
    probationEndDate?: string
    regularizationDate?: string
    contractSignedDate?: string
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
          <ProfileField label="Job title" value={employment.jobTitle} />
          <ProfileField label="Is manager" value={employment.isManager ? "Yes" : "No"} />
          <ProfileField label="Manager" value={employment.managerName} />
          <ProfileField label="Work location" value={employment.workLocation} />
          <ProfileField label="Employment type" value={employment.employmentType} />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Employment dates" icon={CalendarRange}>
        <ProfileFieldGrid>
          <ProfileField label="Hire date" value={employment.hireDate} />
          <ProfileField label="Probation end" value={employment.probationEndDate} />
          <ProfileField label="Regularization" value={employment.regularizationDate} />
          <ProfileField label="Contract signed" value={employment.contractSignedDate} />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
