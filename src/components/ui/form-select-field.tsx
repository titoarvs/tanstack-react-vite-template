import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EMPTY_VALUE = "__empty__"

interface FormSelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
}

export function FormSelectField<T extends FieldValues>({
  name,
  label,
  placeholder = "Select…",
  options,
}: FormSelectFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(v: string) => field.onChange(v === EMPTY_VALUE ? "" : v)}
            value={field.value ? String(field.value) : EMPTY_VALUE}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(opt => (
                <SelectItem
                  key={opt.value || EMPTY_VALUE}
                  value={opt.value === "" ? EMPTY_VALUE : opt.value}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
