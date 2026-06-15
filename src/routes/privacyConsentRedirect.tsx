import { Navigate } from "@tanstack/react-router"

/** Legacy path — privacy consent is shown as a modal on the welcome page. */
export function PrivacyConsentRedirect() {
  return <Navigate to="/welcome" />
}
