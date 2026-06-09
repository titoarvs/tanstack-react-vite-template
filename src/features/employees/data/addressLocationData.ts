import Country from "country-state-city/lib/country"
import * as State from "country-state-city/lib/state"
import type { ICountry, IState } from "country-state-city"

export interface SelectOption {
  value: string
  label: string
}

/** Canonical country name from country-state-city (ISO PH). */
export const DEFAULT_ADDRESS_COUNTRY = "Philippines"

let countriesCache: SelectOption[] | null = null

export function getCountryOptions(): SelectOption[] {
  if (!countriesCache) {
    countriesCache = Country.getAllCountries()
      .map((country: ICountry) => ({
        value: country.name,
        label: country.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  return countriesCache
}

export function resolveCountryIso(countryName?: string): string | undefined {
  if (!countryName?.trim()) return undefined
  const normalized = countryName.trim().toLowerCase()
  const match = Country.getAllCountries().find(
    (country: ICountry) =>
      country.name.toLowerCase() === normalized ||
      country.isoCode.toLowerCase() === normalized
  )
  return match?.isoCode
}

export function getStateOptions(countryName?: string): SelectOption[] {
  const iso = resolveCountryIso(countryName)
  if (!iso) return []
  return State.getStatesOfCountry(iso)
    .map((state: IState) => ({
      value: state.name,
      label: state.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function shouldUseStateSelect(countryName?: string): boolean {
  return getStateOptions(countryName).length > 0
}

export function filterSelectOptions(
  options: SelectOption[],
  query: string
): SelectOption[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return options
  return options.filter(option => option.label.toLowerCase().includes(trimmed))
}
