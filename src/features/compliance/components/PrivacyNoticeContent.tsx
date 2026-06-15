import {
  PRIVACY_NOTICE_SECTIONS,
  PRIVACY_NOTICE_VERSION,
} from "../privacyNotice"

export function PrivacyNoticeContent() {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground">
      <p className="text-xs text-muted-foreground">
        Version {PRIVACY_NOTICE_VERSION} · Effective for ESS access
      </p>
      {PRIVACY_NOTICE_SECTIONS.map(section => (
        <section key={section.title}>
          <h2 className="mb-2 text-base font-semibold text-foreground">{section.title}</h2>
          <div className="space-y-3 text-muted-foreground">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
