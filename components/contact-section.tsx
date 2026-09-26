import { socialLinks } from "@/content/social";

export function ContactSection() {
  return (
    <section id="contact" className="rounded-2xl border border-white/10 bg-panel/65 p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-ink">Contact</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Contact form submission is intentionally omitted until a secure backend endpoint is configured.
        Use the links below and replace placeholders with your live details.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {socialLinks.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="inline-flex w-full flex-col items-start gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-ink transition hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:items-center sm:justify-between"
              target={item.label === "Email" ? undefined : "_blank"}
              rel={item.label === "Email" ? undefined : "noreferrer"}
            >
              <span className="font-medium">{item.label}</span>
              <span className="max-w-full break-all text-xs text-muted sm:text-sm">{item.href}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
