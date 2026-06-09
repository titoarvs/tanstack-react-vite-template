import { MapPin, Phone, UserRound } from "lucide-react"
import type { Employee } from "../../../types"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

function formatGender(gender?: string) {
  if (!gender) return undefined
  return gender
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

interface EdmPersonalTabProps {
  employee: Employee
}

export function EdmPersonalTab({ employee }: EdmPersonalTabProps) {
  const address = employee.contact.address

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Demographics" icon={UserRound}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="demographics"
            label="Date of birth"
            value={employee.demographics.dateOfBirth}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="demographics"
            label="Gender"
            value={formatGender(employee.demographics.gender)}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="demographics"
            label="Civil status"
            value={employee.demographics.maritalStatus}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="demographics"
            label="Nationality"
            value={employee.demographics.nationality}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Address" icon={MapPin}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="Street"
            value={address?.street}
            className="sm:col-span-2"
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="City"
            value={address?.city}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="State"
            value={address?.state}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="Zip code"
            value={address?.zipCode}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="Country"
            value={address?.country}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard
        title="Emergency contact"
        icon={Phone}
        className="lg:col-span-2"
      >
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="emergencyContact"
            label="Name"
            value={employee.emergencyContact?.name}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="emergencyContact"
            label="Phone"
            value={employee.emergencyContact?.phone}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="emergencyContact"
            label="Relationship"
            value={employee.emergencyContact?.relationship}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
