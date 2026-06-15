import { PRIVACY_NOTICE_SECTIONS } from "../privacyNotice"

export function PrivacyNoticeContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground">
      {PRIVACY_NOTICE_SECTIONS.map((section, index) => (
        <section key={section.title}>
          <h2 className="mb-2 font-semibold text-foreground">
            {index + 1}. {section.title}
          </h2>
          <div className="space-y-3 text-muted-foreground">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
