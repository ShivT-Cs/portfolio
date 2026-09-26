import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { projects } from "@/content/projects";
import { ProjectTechnicalVisual } from "@/components/project-technical-visual";

const featuredProjectSlugs = [
  "azure-landing-zone-iac-modules",
  "multi-environment-cicd-angular-dotnet-sql",
  "blob-malware-scanning-defender-storage",
  "azure-devops-workload-visibility-powerbi",
  "aks-platform-engineering",
  "azure-ai-rag-infrastructure",
  "azure-aiops-incident-intelligence",
  "aks-aiops-platform-reliability",
] as const;

const featuredProjects = featuredProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project) => Boolean(project));

const visualGradients = [
  "from-[#1f3f8f]/80 via-[#2f85ff]/60 to-[#0f1830]/95",
  "from-[#16334f]/85 via-[#2f85ff]/45 to-[#101726]/95",
  "from-[#29426c]/85 via-[#1f7cf5]/40 to-[#111c33]/95",
  "from-[#212f57]/85 via-[#2f85ff]/50 to-[#161f39]/95",
  "from-[#0f355f]/80 via-[#337bda]/50 to-[#141f37]/95",
  "from-[#263f65]/80 via-[#2f85ff]/45 to-[#0e1730]/95",
  "from-[#2a2c64]/80 via-[#3d8dff]/50 to-[#131934]/95",
  "from-[#173e60]/80 via-[#4f9eff]/45 to-[#112238]/95",
];

export function FeaturedProjectsStrip() {
  return (
    <section
      id="projects"
      aria-labelledby="featured-projects"
      className="mx-auto mt-2 max-w-6xl px-4 pb-20 md:px-6"
    >
      <div className="section-divider mb-8" />
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Featured Projects</p>
        <h2 id="featured-projects" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
          Selected Azure delivery case studies
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Sanitized, editable drafts focused on architecture decisions, implementation patterns, and security considerations.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {featuredProjects.map((project, index) => {
          if (!project) {
            return null;
          }

          return (
            <MotionWrapper key={project.slug} delay={index * 0.06}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-panel/70 p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/55 focus-within:border-accent/55 sm:p-6">
                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${visualGradients[index % visualGradients.length]} opacity-90`} />
                <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full border border-accent/45 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-accentSoft">
                      Draft Case Study
                    </span>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-ink/90 transition hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      View Case Study <ArrowUpRight size={14} />
                    </Link>
                  </div>

                  <h3 className="text-2xl font-semibold leading-tight text-ink md:text-[1.75rem]">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.problem}</p>

                  <div className="mt-5">
                    <ProjectTechnicalVisual project={project} compact />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </MotionWrapper>
          );
        })}
      </div>
    </section>
  );
}
