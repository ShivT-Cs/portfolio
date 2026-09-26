import Link from "next/link";
import type { ProjectItem } from "@/content/projects";
import {
  getProjectEvidence,
  getEvidenceClassificationLabel,
  getArchitectureClassificationLabel,
} from "@/content/project-evidence";

type EngineeringEvidenceSectionProps = {
  project: ProjectItem;
};

function artifactHref(path: string): string {
  return path.startsWith("public/") ? `/${path.replace(/^public\//, "")}` : path;
}

function toneForClassification(classification: string): string {
  switch (classification) {
    case "Implemented demo evidence":
      return "border-emerald-300/45 bg-emerald-500/12 text-emerald-100";
    case "Production-verified implementation":
      return "border-cyan-300/45 bg-cyan-500/12 text-cyan-100";
    default:
      return "border-amber-300/45 bg-amber-500/12 text-amber-100";
  }
}

function resultTone(result: "passed" | "failed" | "pending"): string {
  switch (result) {
    case "passed":
      return "text-emerald-200";
    case "failed":
      return "text-rose-200";
    default:
      return "text-amber-200";
  }
}

export function EngineeringEvidenceSection({ project }: EngineeringEvidenceSectionProps) {
  const evidence = getProjectEvidence(project.slug);

  if (!evidence) {
    return (
      <section className="mt-6 rounded-xl border border-rose-300/35 bg-rose-500/10 p-5">
        <h2 className="text-lg font-semibold text-ink">Engineering Evidence</h2>
        <p className="mt-2 text-sm text-rose-100">Evidence pending: no centralized evidence record is available for this case study.</p>
      </section>
    );
  }

  const evidenceLabel = getEvidenceClassificationLabel(evidence.classification);
  const architectureLabel = getArchitectureClassificationLabel(project.slug);

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-surface/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">Engineering Evidence</h2>
        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] ${toneForClassification(evidenceLabel)}`}>
          {evidenceLabel}
        </span>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-panel/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Implemented Source Files</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {evidence.implementedFiles.map((artifact) => (
              <li key={`${artifact.path}-${artifact.module}`} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
                <p className="text-ink">{artifact.module}</p>
                {artifact.status === "implemented" ? (
                  <a href={artifactHref(artifact.path)} className="text-xs text-accentSoft hover:text-ink">
                    {artifact.path}
                  </a>
                ) : (
                  <p className="text-xs">{artifact.path}</p>
                )}
                <p className={`mt-1 text-xs ${artifact.status === "implemented" ? "text-emerald-200" : "text-amber-200"}`}>
                  {artifact.status === "implemented" ? "Implemented" : "Evidence pending"}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg border border-white/10 bg-panel/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Architecture Evidence</h3>
          <p className="mt-3 text-sm text-muted">Diagram classification: {architectureLabel}</p>
          <p className="mt-2 text-sm text-muted">Sanitized data flow: {evidence.sanitizedDataFlow}</p>
          <p className="mt-2 text-xs text-muted">Diagram source id: {evidence.diagramId}</p>

          {evidence.demoRoutes.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.12em] text-accentSoft">Linked Demo Routes</p>
              <ul className="mt-2 space-y-2 text-sm">
                {evidence.demoRoutes.map((route) => (
                  <li key={route.route}>
                    <Link href={route.route} className="text-accentSoft hover:text-ink">
                      {route.label} ({route.route})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 text-xs text-amber-200">Evidence pending: no implemented demo route is linked for this case study.</p>
          )}
        </article>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-panel/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Automated Tests and Results</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {evidence.automatedTests.map((testItem) => (
              <li key={testItem.path} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
                <p className="text-ink">{testItem.scope}</p>
                <p className="text-xs">{testItem.path}</p>
              </li>
            ))}
          </ul>

          <p className={`mt-3 text-sm ${resultTone(evidence.latestTestRun.result)}`}>
            Latest test run ({evidence.latestTestRun.date}): {evidence.latestTestRun.details}
          </p>
          <p className="mt-1 text-xs text-muted">Command: {evidence.latestTestRun.command}</p>

          <p className={`mt-3 text-sm ${resultTone(evidence.latestBuildRun.result)}`}>
            Latest build run ({evidence.latestBuildRun.date}): {evidence.latestBuildRun.details}
          </p>
          <p className="mt-1 text-xs text-muted">Command: {evidence.latestBuildRun.command}</p>
        </article>

        <article className="rounded-lg border border-white/10 bg-panel/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Limitations and Verification Gaps</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {evidence.limitations.map((item) => (
              <li key={item} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-accentSoft">Evidence Pending</h4>
          <ul className="mt-2 space-y-2 text-sm text-amber-200">
            {evidence.evidencePending.map((item) => (
              <li key={item} className="rounded-md border border-amber-300/25 bg-amber-500/10 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="mt-5 rounded-lg border border-white/10 bg-panel/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Evidence Status</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
            <span className="text-ink">Local checks:</span> {evidence.verificationStatus.localChecks}
          </li>
          <li className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
            <span className="text-ink">CI checks:</span> {evidence.verificationStatus.ciChecks}
          </li>
          <li className="rounded-md border border-amber-300/25 bg-amber-500/10 px-3 py-2 text-amber-200">
            <span className="text-ink">Azure deployment:</span> {evidence.verificationStatus.azureDeployment}
          </li>
        </ul>
      </article>

      <article className="mt-5 rounded-lg border border-white/10 bg-panel/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Reproduction and Dependencies</h3>
        <p className="mt-2 text-xs text-muted">Dependencies</p>
        <ul className="mt-2 space-y-2 text-sm text-muted">
          {evidence.reproduction.dependencies.map((dependency) => (
            <li key={dependency} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
              {dependency}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-muted">Reproduction steps</p>
        <ol className="mt-2 space-y-2 text-sm text-muted">
          {evidence.reproduction.steps.map((step) => (
            <li key={step} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
              {step}
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}
