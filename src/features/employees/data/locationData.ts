import { Country, State, type ICountry, type IState } from "country-state-city"
import { DEFAULT_PHONE_COUNTRY_ISO } from "./locationConstants"

export interface SelectOption {
  value: string
  label: string
}

export interface PhoneCountryOption {
  value: string
  label: string
  dialCode: string
  phonecode: string
}

let countriesCache: SelectOption[] | null = null
let phoneCountriesCache: PhoneCountryOption[] | null = null

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

export function getPhoneCountryOptions(): PhoneCountryOption[] {
  if (!phoneCountriesCache) {
    phoneCountriesCache = Country.getAllCountries()
      .map((country: ICountry) => ({
        value: country.isoCode,
        label: `${country.name} (+${country.phonecode})`,
        dialCode: `+${country.phonecode}`,
        phonecode: country.phonecode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))

    const philippinesIndex = phoneCountriesCache.findIndex(
      option => option.value === DEFAULT_PHONE_COUNTRY_ISO
    )
    if (philippinesIndex > 0) {
      const [philippines] = phoneCountriesCache.splice(philippinesIndex, 1)
      phoneCountriesCache.unshift(philippines)
    }
  }
  return phoneCountriesCache
}

export function getPhoneCountryByIso(
  iso?: string
): PhoneCountryOption | undefined {
  if (!iso) return undefined
  return getPhoneCountryOptions().find(option => option.value === iso)
}

export function filterSelectOptions(
  options: SelectOption[],
  query: string
): SelectOption[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return options
  return options.filter(option => option.label.toLowerCase().includes(trimmed))
}
