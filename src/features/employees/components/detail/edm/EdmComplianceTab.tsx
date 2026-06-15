import { ScrollText, ShieldCheck } from "lucide-react"
import type { Employee } from "../../../types"
import { formatBoolean } from "../../../edm/fieldMasking"
import { ProfileFieldGrid } from "../EmployeeProfileFields"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileField } from "./EdmProfileField"

interface EdmComplianceTabProps {
  employee: Employee
}

export function EdmComplianceTab({ employee }: EdmComplianceTabProps) {
  const compliance = employee.compliance
  const audit = employee.audit

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProfileInfoCard title="Data privacy" icon={ShieldCheck}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="privacyConsent"
            label="Privacy consent signed"
            value={
              compliance?.privacyConsentSigned != null
                ? formatBoolean(compliance.privacyConsentSigned)
                : undefined
            }
          />
          <EdmProfileField
            employee={employee}
            fieldKey="privacyConsent"
            label="Consent date"
            value={compliance?.privacyConsentDate}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="privacyConsent"
            label="Consent timestamp"
            value={
              compliance?.privacyConsentAt
                ? new Date(compliance.privacyConsentAt).toLocaleString()
                : undefined
            }
          />
          <EdmProfileField
            employee={employee}
            fieldKey="privacyConsent"
            label="IP address"
            value={compliance?.privacyConsentIpAddress}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="privacyConsent"
            label="Notice version"
            value={compliance?.privacyNoticeVersion}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="dataSubjectAccess"
            label="Data subject access signed"
            value={
              compliance?.dataSubjectAccessSigned != null
                ? formatBoolean(compliance.dataSubjectAccessSigned)
                : undefined
            }
          />
          <EdmProfileField
            employee={employee}
            fieldKey="retentionDeletion"
            label="Retention period (years)"
            value={
              compliance?.retentionPeriodYears != null
                ? String(compliance.retentionPeriodYears)
                : undefined
            }
          />
          <EdmProfileField
            employee={employee}
            fieldKey="retentionDeletion"
            label="Date of data deletion"
            value={compliance?.dataDeletionDate}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>

      <ProfileInfoCard title="Audit trail" icon={ScrollText}>
        <ProfileFieldGrid>
          <EdmProfileField
            employee={employee}
            fieldKey="auditTrail"
            label="Created by"
            value={audit?.createdBy}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="auditTrail"
            label="Created date"
            value={employee.createdAt?.slice(0, 10)}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="auditTrail"
            label="Updated by"
            value={audit?.updatedBy}
          />
          <EdmProfileField
            employee={employee}
            fieldKey="auditTrail"
            label="Updated date"
            value={employee.updatedAt?.slice(0, 10)}
          />
        </ProfileFieldGrid>
      </ProfileInfoCard>
    </div>
  )
}
