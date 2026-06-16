import { Upload, X, ExternalLink } from "lucide-react"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DocumentRequirement } from "@/features/employees/lib/documentRequirementPolicy"
import type { PreEmploymentDocument } from "@/features/pre-employment/types"

const MAX_FILE_BYTES = 5 * 1024 * 1024

interface DocumentUploadFieldProps {
  requirement: DocumentRequirement
  documents: PreEmploymentDocument[]
  onChange: (documents: PreEmploymentDocument[]) => void
}

export function DocumentUploadField({
  requirement,
  documents,
  onChange,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const matching = documents.filter(d => d.type === requirement.type)
  const count = matching.length
  const isComplete = count >= requirement.minCount

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      alert("File must be under 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const doc: PreEmploymentDocument = {
        id: crypto.randomUUID(),
        type: requirement.type,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        dataUrl: reader.result as string,
      }
      onChange([...documents, doc])
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const removeDoc = (id: string) => {
    onChange(documents.filter(d => d.id !== id))
  }

  return (
    <div className="rounded-lg border border-border/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{requirement.label}</p>
          <p className="text-xs text-muted-foreground">
            {requirement.categoryLabel}
            {requirement.minCount > 1 ? ` · ${count}/${requirement.minCount} uploaded` : ""}
          </p>
        </div>
        <Badge variant={requirement.priority === "required" ? "default" : "secondary"}>
          {requirement.priority === "required" ? "Required" : "Secondary"}
        </Badge>
      </div>

      {matching.length > 0 && (
        <ul className="mt-3 space-y-2">
          {matching.map(doc => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm"
            >
              <span className="truncate">{doc.fileName}</span>
              <div className="flex shrink-0 items-center gap-1">
                {doc.dataUrl && (
                  <Button type="button" variant="ghost" size="sm" asChild>
                    <a href={doc.dataUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDoc(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {isComplete && requirement.minCount === 1 ? "Replace file" : "Upload file"}
        </Button>
      </div>
    </div>
  )
}
