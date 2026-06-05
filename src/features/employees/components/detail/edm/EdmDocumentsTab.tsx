import { FileText, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Employee } from "../../../types"
import { DOCUMENT_TYPE_LABELS } from "../../../types/documents"
import { useEdmFieldAccess } from "../../../hooks/useEdmFieldAccess"
import { ProfileInfoCard } from "../ProfileInfoCard"
import { EdmProfileSection } from "./EdmProfileField"

interface EdmDocumentsTabProps {
  employee: Employee
}

export function EdmDocumentsTab({ employee }: EdmDocumentsTabProps) {
  const docsAccess = useEdmFieldAccess(employee, "uploadedDocuments")
  const documents = employee.documents ?? []
  const checklist = employee.onboardingChecklist ?? []

  return (
    <div className="space-y-4">
      <EdmProfileSection employee={employee} fieldKey="uploadedDocuments">
        <ProfileInfoCard title="Document repository" icon={FileText}>
          {docsAccess.canEdit && (
            <div className="mb-4">
              <Button type="button" variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4" />
                Upload document (mock)
              </Button>
            </div>
          )}
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents on file.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">File</th>
                    <th className="py-2 pr-4">Uploaded by</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2">Version</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id} className="border-b border-border/60">
                      <td className="py-3 pr-4">{DOCUMENT_TYPE_LABELS[doc.type]}</td>
                      <td className="py-3 pr-4 font-medium">{doc.fileName}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{doc.uploadedBy}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{doc.uploadedAt}</td>
                      <td className="py-3">v{doc.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ProfileInfoCard>
      </EdmProfileSection>

      <EdmProfileSection employee={employee} fieldKey="onboardingChecklist">
        <ProfileInfoCard title="Onboarding checklist" icon={FileText}>
          {checklist.length === 0 ? (
            <p className="text-sm text-muted-foreground">Checklist not started.</p>
          ) : (
            <ul className="space-y-2">
              {checklist.map(item => (
                <li
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge
                    variant={
                      item.status === "complete"
                        ? "default"
                        : item.status === "expired"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {item.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ProfileInfoCard>
      </EdmProfileSection>
    </div>
  )
}
