import { Mail, UserRound } from "lucide-react"
import { ProfileField, ProfileFieldGrid } from "./EmployeeProfileFields"
import { ProfileInfoCard } from "./ProfileInfoCard"

interface EmployeePersonalTabProps {
  personal: {
    employeeId: string
    dateOfBirth?: string
    gender?: string
    nationality?: string
    maritalStatus?: string
    email: string
    phone: string
    formattedAddress?: string
  }
}

function formatGender(gender?: string) {
  if (!gender) return undefined
  return gender
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function EmployeePersonalTab({ personal }: EmployeePersonalTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Identity" icon={UserRound}>
        <ProfileFieldGrid>
          <ProfileField label="Employee ID" value={personal.employeeId} />
          <ProfileField label="Date of birth" value={personal.dateOfBirth} />
          <ProfileField label="Gender" value={formatGender(personal.gender)} />
          <ProfileField label="Nationality" value={personal.nationality} />
          <ProfileField label="Marital status" value={personal.maritalStatus} />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Contact" icon={Mail}>
        <ProfileFieldGrid>
          <ProfileField label="Email" value={personal.email} />
          <ProfileField label="Phone" value={personal.phone} />
          <ProfileField
            label="Address"
            value={personal.formattedAddress}
            className="sm:col-span-2"
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
