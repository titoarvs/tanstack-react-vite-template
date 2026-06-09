import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  formatNationalDisplay,
  formatStoredPhone,
  getPhoneExample,
  getPhonePlaceholder,
  parseStoredPhone,
  sanitizePhilippineNational,
} from "../../lib/phone"

interface PhoneInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showExample?: boolean
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  className,
  showExample = true,
}: PhoneInputProps) {
  const parsed = useMemo(() => parseStoredPhone(value), [value])
  const [national, setNational] = useState(parsed.national)

  useEffect(() => {
    setNational(parsed.national)
  }, [parsed.national])

  const displayValue = formatNationalDisplay(parsed.iso, national)
  const displayPlaceholder = placeholder ?? getPhonePlaceholder(parsed.iso)
  const example = getPhoneExample(parsed.iso)

  const updateNational = (raw: string) => {
    const digits = sanitizePhilippineNational(raw)
    setNational(digits)
    onChange(formatStoredPhone(parsed.iso, digits))
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <Input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={displayValue}
        onChange={event => updateNational(event.target.value)}
        placeholder={displayPlaceholder}
        disabled={disabled}
        className="bg-card"
      />
      {showExample && example ? (
        <p className="text-xs text-muted-foreground">e.g. {example}</p>
      ) : null}
    </div>
  )
}
