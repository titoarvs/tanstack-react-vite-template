import { employeeCardFieldGridClass } from "./employeeDirectoryLayout"

interface EmployeeCardFieldRowProps {
  label: string
  value: string
}

export function EmployeeCardFieldRow({ label, value }: EmployeeCardFieldRowProps) {
  return (
    <div className={employeeCardFieldGridClass}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-right text-sm font-medium" title={value}>
        {value}
      </span>
    </div>
  )
}
