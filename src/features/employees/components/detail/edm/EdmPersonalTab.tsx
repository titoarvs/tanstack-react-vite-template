import { Mail, Phone, UserRound } from "lucide-react"
import { EmployeeAvatar } from "@/components/ui/avatar"
import {
  getFullName,
  type Employee,
} from "../../../types"
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
  const fullName = getFullName(employee)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Identity" icon={UserRound}>
        <div className="mb-4 flex items-center gap-4">
          <EmployeeAvatar
            name={fullName}
            src={employee.photoUrl}
            className="h-16 w-16"
          />
        </div>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="employeeId"
            label="Employee ID"
            value={employee.employeeId}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="name"
            label="Full name"
            value={fullName}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="preferredName"
            label="Preferred name"
            value={employee.preferredName}
          />
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

      <ProfileInfoCard title="Contact" icon={Mail}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="contact"
            label="Work email"
            value={employee.contact.email}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="contact"
            label="Phone"
            value={employee.contact.phone}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="Home address"
            value={employee.contact.address}
            className="sm:col-span-2"
          />
          <EdmProfileField
            employee={employee}
            fieldKey="address"
            label="Province"
            value={employee.contact.province}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Emergency contact" icon={Phone} className="lg:col-span-2">
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
