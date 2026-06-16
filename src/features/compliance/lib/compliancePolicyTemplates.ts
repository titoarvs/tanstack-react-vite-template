import { withMockLegalFooter } from "@/features/employees/lib/documentMockContent"
import type { DocumentType } from "@/features/employees/types/documents"

const POLICY_BODIES: Partial<Record<DocumentType, string>> = {
  nda: withMockLegalFooter(
    `NON-DISCLOSURE AGREEMENT (NDA)

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means non-public information belonging to TitoHRIS Demo Corp., including business plans, financial data, customer lists, pricing, product roadmaps, source code, credentials, and internal processes.

2. OBLIGATIONS
You agree to:
  (a) use Confidential Information only for authorized work;
  (b) not disclose it to third parties without written approval;
  (c) protect it with at least the same care you use for your own sensitive information; and
  (d) return or destroy materials upon request or separation.

3. EXCLUSIONS
Information that is public without your breach, independently developed, or lawfully received from a third party without restriction is not covered.

4. TERM
Confidentiality obligations survive termination of employment for the period required by law and company policy.

5. REMEDIES
Unauthorized disclosure may result in disciplinary action, termination, and pursuit of legal remedies.`,
    "NDA"
  ),
  non_compete: withMockLegalFooter(
    `NON-COMPETE AND NON-SOLICITATION AGREEMENT

1. PURPOSE
To protect legitimate business interests, you agree to reasonable restrictions on competitive activity after accessing confidential information and customer relationships.

2. NON-COMPETE
During employment and for twelve (12) months after separation, you will not engage in competing business activities within the agreed territory where you had material involvement, subject to applicable law.

3. NON-SOLICITATION
You will not solicit company employees or customers for a competing venture during the restriction period, except as permitted by law.

4. REASONABLENESS
You acknowledge that restrictions are limited in scope, duration, and geography to the extent permitted by local regulations.

5. CONSIDERATION
This agreement is supported by your employment, access to confidential information, and training provided by the Company.`,
    "NON-COMPETE"
  ),
  acceptable_use_policy: withMockLegalFooter(
    `ACCEPTABLE USE POLICY (AUP)

1. AUTHORIZED USE
Company systems, networks, email, and cloud services are provided for authorized business purposes. Personal use must be incidental and must not interfere with work or security.

2. PROHIBITED ACTIVITIES
You must not:
  (a) share passwords or bypass authentication;
  (b) install unauthorized software or access restricted systems;
  (c) transmit malware, phishing, or harassing content;
  (d) store unlawful material; or
  (e) exfiltrate company data to personal accounts without approval.

3. DATA PROTECTION
Classify data appropriately, encrypt sensitive files where required, and follow clean-desk and device-lock practices.

4. MONITORING
The Company may monitor systems as permitted by law and policy to protect assets and investigate incidents.

5. INCIDENT REPORTING
Report suspected security incidents to IT or HR immediately. Do not attempt unauthorized remediation on production systems.

6. CONSEQUENCES
Violations may result in access revocation, disciplinary action, and legal referral where appropriate.`,
    "AUP"
  ),
}

export function getCompliancePolicyBody(type: DocumentType): string {
  return (
    POLICY_BODIES[type] ??
    withMockLegalFooter(
      `Review and acknowledge the ${type.replace(/_/g, " ")} policy before signing.`,
      type.toUpperCase()
    )
  )
}
