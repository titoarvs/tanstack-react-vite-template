import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PhoneInput } from "./PhoneInput"

interface PhoneFieldProps {
  name: string
  label: string
  placeholder?: string
  className?: string
  showExample?: boolean
}

export function PhoneField({
  name,
  label,
  placeholder,
  className,
  showExample = true,
}: PhoneFieldProps) {
  const form = useFormContext<Record<string, unknown>>()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              placeholder={placeholder}
              showExample={showExample}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
