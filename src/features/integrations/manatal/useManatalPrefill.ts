import { useMemo } from "react"
import {
  prefillEmploymentFromManatal,
  type ManatalEmploymentSnapshot,
  type ManatalPrefillContext,
} from "./manatalPrefill"

export function useManatalPrefill(context?: ManatalPrefillContext): ManatalEmploymentSnapshot {
  return useMemo(() => prefillEmploymentFromManatal(context), [context])
}
