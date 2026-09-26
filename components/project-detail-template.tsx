import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/content/projects";
import { ProjectTechnicalVisual } from "@/components/project-technical-visual";
import { ArchitectureExplorer } from "@/components/architecture-explorer";
import { EngineeringEvidenceSection } from "@/components/engineering-evidence-section";

type ProjectDetailTemplateProps = {
  project: ProjectItem;
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="rounded-lg border border-white/10 bg-surface/45 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetailTemplate({ project }: ProjectDetailTemplateProps) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 md:px-6">
      <Link href="/#projects" className="text-sm text-accentSoft transition hover:text-ink">
        {"<- Back to featured projects"}
      </Link>

      <article className="mt-8 rounded-2xl border border-white/12 bg-panel/65 p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-block rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accentSoft">
              Draft Case Study
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink md:text-4xl">{project.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{project.problem}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-xl border border-white/10 bg-surface/50 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-ink">Problem</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.problem}</p>
          </section>

          <section className="rounded-xl border border-white/10 bg-surface/50 p-5">
            <h2 className="text-lg font-semibold text-ink">Architecture</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.architecture}</p>
            <div className="mt-5">
              <ProjectTechnicalVisual project={project} />
              <p className="mt-2 text-xs text-muted">
                Reference/proposed architecture diagram for portfolio demonstration. Not a client production architecture.
              </p>
              {project.slug === "azure-landing-zone-iac-modules" ? (
                <a href="/diagrams/landing-zone-sanitized.svg" className="mt-2 inline-block text-xs text-accentSoft hover:text-ink">
                  View sanitized landing zone diagram
                </a>
              ) : null}
            </div>

            <ArchitectureExplorer diagramId={project.slug} className="mt-5" />
          </section>

          <section className="rounded-xl border border-white/10 bg-surface/50 p-5">
            <h2 className="text-lg font-semibold text-ink">Security</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.security}</p>
            <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-accentSoft">Verified Outcomes</h3>
            <BulletList items={project.verifiedOutcomes} />
          </section>
        </div>

        {project.demoUrl ? (
          <section className="mt-6 rounded-xl border border-accent/35 bg-accent/10 p-5">
            <h2 className="text-lg font-semibold text-ink">Interactive Demo</h2>
            <p className="mt-2 text-sm text-muted">
              Explore a local technical simulation with deterministic logic, explainable state transitions, and no live cloud integration.
            </p>
            <Link
              href={project.demoUrl}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-accent/45 bg-accent/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Try Interactive Demo <ArrowUpRight size={16} />
            </Link>
          </section>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-surface/50 p-5">
            <h2 className="text-lg font-semibold text-ink">Design Decisions</h2>
            <BulletList items={project.designDecisions} />
          </section>

          <section className="rounded-xl border border-white/10 bg-surface/50 p-5">
            <h2 className="text-lg font-semibold text-ink">Implementation</h2>
            <BulletList items={project.implementation} />
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-white/10 bg-surface/50 p-5">
          <h2 className="text-lg font-semibold text-ink">Trade-offs</h2>
          <BulletList items={project.tradeOffs} />
        </section>

        <EngineeringEvidenceSection project={project} />
      </article>
    </main>
  );
}
