import { certifications } from "@/content/certifications";

export function CertificationGrid() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert) => (
        <article key={cert.name} className="rounded-xl border border-white/10 bg-panel/65 p-5">
          <h3 className="text-base font-semibold text-ink">{cert.name}</h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
            {cert.status === "verified" ? "Verified" : "Owner verification pending"}
          </p>
        </article>
      ))}
    </div>
  );
}
