import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/content/projects";

type ProjectCardProps = {
  project: ProjectItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-panel/65 p-6 shadow-card transition hover:-translate-y-1 hover:border-accent/50">
      <div className="mb-4 inline-flex w-fit rounded-full border border-accent/40 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-accentSoft">
        Draft
      </div>

      <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.problem}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accentSoft transition group-hover:text-ink"
        >
          Read case study <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
