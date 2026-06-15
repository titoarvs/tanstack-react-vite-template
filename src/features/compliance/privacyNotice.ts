export const PRIVACY_NOTICE_VERSION = "1.0"

export interface PrivacyNoticeSection {
  title: string
  paragraphs: string[]
}

export const PRIVACY_NOTICE_SECTIONS: PrivacyNoticeSection[] = [
  {
    title: "Introduction",
    paragraphs: [
      "This Privacy Notice explains how TitoHRIS Demo Co. (\"the Company\") collects, uses, stores, and protects your personal information when you use the Employee Self-Service (ESS) portal.",
      "We process personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.",
    ],
  },
  {
    title: "Personal data we collect",
    paragraphs: [
      "We may collect identification and contact details, employment information, government-issued numbers, emergency contact details, and documents you upload through the ESS portal.",
      "Data is collected directly from you, from your employer (HR), or from systems integrated with TitoHRIS for legitimate HR purposes.",
    ],
  },
  {
    title: "How we use your data",
    paragraphs: [
      "Your personal data is used to administer employment, payroll, benefits, compliance, workplace safety, and internal communications.",
      "We do not sell your personal data. Access is limited to authorized personnel based on role and business need.",
    ],
  },
  {
    title: "Your rights",
    paragraphs: [
      "You have the right to be informed, to access, to object, to erasure or blocking, to damages, to file a complaint with the National Privacy Commission, and to data portability where applicable.",
      "To exercise your rights, contact your HR department or the Company's Data Protection Officer.",
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      "Personal data is retained only for as long as necessary for employment and legal obligations, then securely deleted or anonymized.",
      "We implement organizational, physical, and technical safeguards appropriate to the sensitivity of HR data.",
    ],
  },
]
