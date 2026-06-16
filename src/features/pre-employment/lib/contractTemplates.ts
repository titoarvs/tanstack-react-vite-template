import type { ContractType } from "@/features/employees/lib/documentRequirementPolicy"
import { withMockLegalFooter } from "@/features/employees/lib/documentMockContent"
import type { PreEmploymentInvite } from "@/features/pre-employment/types"
import { EMPLOYMENT_TYPES } from "@/features/employees/data/masterData"

export const CONTRACT_VERSIONS: Record<ContractType, string> = {
  job_offer: "2026-01",
  employment_contract: "2026-01",
  moa: "2026-01",
}

export const CONTRACT_TITLES: Record<ContractType, string> = {
  job_offer: "Job Offer Letter",
  employment_contract: "Employment Contract",
  moa: "Memorandum of Agreement (MOA)",
}

export function getContractBody(
  contractType: ContractType,
  invite: PreEmploymentInvite
): string {
  const name = `${invite.firstName} ${invite.lastName}`.trim()
  const position = invite.intendedPosition ?? "the assigned role"
  const department = invite.intendedDepartment ?? "the assigned department"
  const startDate = invite.intendedHireDate ?? "your start date"
  const employmentLabel =
    EMPLOYMENT_TYPES.find(t => t.value === invite.intendedEmploymentType)?.label ??
    invite.intendedEmploymentType
  const workLocation = invite.intendedWorkLocation ?? "assigned work location"

  switch (contractType) {
    case "job_offer":
      return withMockLegalFooter(
        `JOB OFFER LETTER

Date: ${new Date().toLocaleDateString()}
Candidate: ${name}

Dear ${name},

We are pleased to offer you the position of ${position} in ${department}, effective ${startDate}, on a ${employmentLabel} basis at our ${workLocation} location.

1. POSITION AND DUTIES
You will report to your department head and perform duties consistent with your role, including projects assigned during onboarding and regular performance reviews.

2. COMPENSATION
Your compensation package will be communicated separately by HR, subject to statutory deductions and company payroll schedules. Any equity or bonus components, if applicable, are governed by separate plan documents.

3. BENEFITS
Eligible benefits (health, leave, and statutory contributions) begin on your start date, subject to plan rules and waiting periods defined in the employee handbook.

4. CONDITIONS OF OFFER
This offer is contingent upon:
  (a) satisfactory completion of pre-employment requirements;
  (b) background and reference checks, where applicable;
  (c) HR approval and countersignature; and
  (d) your ability to legally work at the assigned location.

5. AT-WILL / PROBATION
Unless otherwise stated in your employment contract, employment may be subject to a probationary period and applicable labor regulations.

6. ACCEPTANCE
Please sign below to accept this offer. Your start date and onboarding schedule will be confirmed by HR after document review.`,
        "JOB-OFFER"
      )
    case "employment_contract":
      return withMockLegalFooter(
        `EMPLOYMENT CONTRACT

This Employment Contract ("Agreement") is entered into between TitoHRIS Demo Corp. ("Company") and ${name} ("Employee").

1. ENGAGEMENT
The Company engages the Employee as ${position} in ${department}, ${employmentLabel}, commencing ${startDate}, primarily at ${workLocation}.

2. DUTIES AND PERFORMANCE
The Employee shall devote reasonable business efforts to assigned duties, follow lawful instructions, and meet performance standards set by the Company.

3. COMPENSATION AND BENEFITS
Salary, allowances, and benefits are as stated in the offer letter and HR records. The Company may adjust compensation in accordance with policy and law.

4. WORKING HOURS AND LEAVE
Working hours, rest days, and leave entitlements follow company policy and applicable labor law.

5. CONFIDENTIALITY
The Employee shall not disclose confidential information during or after employment, except as required by law or authorized in writing.

6. COMPANY PROPERTY
Equipment, credentials, and data provided by the Company remain company property and must be returned upon separation.

7. TERMINATION
Either party may terminate this Agreement as permitted by law and company policy, including notice and clearance requirements.

8. GOVERNING POLICIES
The employee handbook, code of conduct, and cybersecurity policies are incorporated by reference.`,
        "EMP-CONTRACT"
      )
    case "moa":
      return withMockLegalFooter(
        `MEMORANDUM OF AGREEMENT (ACADEMIC INTERNSHIP)

Parties:
  • TitoHRIS Demo Corp. ("Company")
  • ${name} ("Intern")
  • Affiliated academic institution ("School")

1. PROGRAM OVERVIEW
The Intern will participate in an academic internship in ${department} as ${position}, commencing ${startDate}, to fulfill academic requirements coordinated with the School.

2. SUPERVISION
The Company will assign a supervisor; the School will assign a faculty coordinator. Both parties will participate in periodic evaluations.

3. SCOPE OF WORK
Intern duties are educational in nature and may include shadowing, supervised tasks, and project work suitable for academic credit.

4. SCHEDULE
Internship hours follow the agreed schedule between Company, Intern, and School, respecting labor rules for interns where applicable.

5. CONFIDENTIALITY
The Intern shall protect confidential information and comply with the Company acceptable use and security policies.

6. ACADEMIC CREDIT
Credit issuance is the responsibility of the School based on completed hours, deliverables, and evaluation forms submitted by the Company.

7. NO EMPLOYMENT GUARANTEE
Completion of the internship does not guarantee future employment with the Company.`,
        "MOA-INTERN"
      )
    default:
      return ""
  }
}
