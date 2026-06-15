import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/ui/searchable-select"
import { DEFAULT_ADDRESS_COUNTRY } from "../../data/locationConstants"
import type { SelectOption } from "../../data/locationData"

type LocationDataModule = typeof import("../../data/locationData")

const loadLocationData = (): Promise<LocationDataModule> =>
  import("../../data/locationData")

interface AddressFieldsProps {
  /** Form field prefix, e.g. "address" for address.street */
  prefix?: string
  optional?: boolean
}

function AddressSearchableSelectField({
  name,
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  options,
  onValueChange,
  required,
}: {
  name: string
  label: string
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  options: SearchableSelectOption[]
  onValueChange?: (value: string) => void
  required?: boolean
}) {
  const form = useFormContext<Record<string, unknown>>()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <SearchableSelect
              value={typeof field.value === "string" ? field.value : ""}
              onValueChange={value => {
                field.onChange(value)
                onValueChange?.(value)
              }}
              options={options}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function AddressTextField({
  name,
  label,
  placeholder,
  className,
  required,
}: {
  name: string
  label: string
  placeholder?: string
  className?: string
  required?: boolean
}) {
  const form = useFormContext<Record<string, unknown>>()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
              placeholder={placeholder}
              className="bg-card"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function AddressFields({
  prefix = "address",
  optional = true,
}: AddressFieldsProps) {
  const form = useFormContext<Record<string, unknown>>()
  const required = !optional
  const [locationData, setLocationData] = useState<LocationDataModule | null>(
    null
  )

  const country = form.watch(`${prefix}.country`) as string | undefined
  const state = form.watch(`${prefix}.state`) as string | undefined

  useEffect(() => {
    let active = true
    loadLocationData().then(module => {
      if (active) setLocationData(module)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const currentCountry = form.getValues(`${prefix}.country`) as
      | string
      | undefined
    if (!currentCountry?.trim()) {
      form.setValue(
        `${prefix}.country` as never,
        DEFAULT_ADDRESS_COUNTRY as never,
        { shouldDirty: false, shouldValidate: false }
      )
    }
  }, [form, prefix])

  const countryOptions: SelectOption[] = locationData?.getCountryOptions() ?? []
  const stateOptions: SelectOption[] = useMemo(
    () => locationData?.getStateOptions(country) ?? [],
    [locationData, country]
  )
  const useStateSelect = locationData?.shouldUseStateSelect(country) ?? false

  useEffect(() => {
    if (!country) return
    if (
      useStateSelect &&
      state &&
      !stateOptions.some(option => option.value === state)
    ) {
      form.setValue(`${prefix}.state`, undefined)
    }
  }, [country, form, prefix, state, stateOptions, useStateSelect])

  return (
    <>
      <AddressTextField
        name={`${prefix}.street`}
        label="Street"
        className="sm:col-span-2"
        required={required}
      />
      <AddressSearchableSelectField
        name={`${prefix}.country`}
        label="Country"
        placeholder="Select country"
        searchPlaceholder="Search countries…"
        emptyMessage="No countries found"
        options={countryOptions}
        onValueChange={() => form.setValue(`${prefix}.state`, undefined)}
        required={required}
      />
      {useStateSelect ? (
        <AddressSearchableSelectField
          name={`${prefix}.state`}
          label="State / province"
          placeholder="Select state or province"
          searchPlaceholder="Search states…"
          emptyMessage="No states found"
          options={stateOptions}
          required={required}
        />
      ) : (
        <AddressTextField
          name={`${prefix}.state`}
          label="State / province"
          placeholder="Enter state or province"
          required={required}
        />
      )}
      <AddressTextField
        name={`${prefix}.city`}
        label="City"
        placeholder="Enter city"
        required={required}
      />
      <AddressTextField
        name={`${prefix}.zipCode`}
        label="Zip code"
        placeholder="Enter zip or postal code"
        required={required}
      />
    </>
  )
}
