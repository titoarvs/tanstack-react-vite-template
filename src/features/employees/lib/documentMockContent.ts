/** Shared mock boilerplate appended to legal documents for demo scrolling / review UX. */

export const MOCK_LEGAL_FOOTER = `
GENERAL PROVISIONS

1. Entire Agreement. This document, together with any exhibits and company policies incorporated by reference, constitutes the entire agreement between the parties regarding the subject matter herein.

2. Amendments. Any amendment must be in writing and signed by both parties (or authorized company representative).

3. Severability. If any provision is held invalid, the remaining provisions continue in full force.

4. Notices. Official notices may be sent to the email address on file with HR or to the company registered office.

5. Governing Law. This agreement is governed by the laws applicable in the jurisdiction of the company's principal place of business, without regard to conflict-of-law rules.

ACKNOWLEDGMENT

By signing electronically below, you confirm that you have read this document in full, had the opportunity to ask questions, and agree to be bound by its terms.

Document ID: DEMO-{docId}
Version: 2026-01
`.trim()

export function withMockLegalFooter(body: string, docId: string): string {
  return `${body.trim()}\n\n${MOCK_LEGAL_FOOTER.replace("{docId}", docId)}`
}
