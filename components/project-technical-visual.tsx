import type { ProjectItem } from "@/content/projects";

type ProjectTechnicalVisualProps = {
  project: ProjectItem;
  compact?: boolean;
};

const visualMap: Record<ProjectItem["visualVariant"], { lines: string[]; labels: string[] }> = {
  "landing-zone": {
    lines: ["M8 52 C26 40, 34 36, 49 27", "M49 27 C63 35, 74 38, 92 50", "M49 27 C50 49, 52 67, 52 84"],
    labels: ["Mgmt Groups", "Policy", "Networking", "Observability"],
  },
  cicd: {
    lines: ["M6 24 C24 24, 34 24, 48 24", "M48 24 C63 24, 72 24, 90 24", "M48 24 C48 46, 48 61, 48 84"],
    labels: ["Source", "Build", "Release", "DB Deploy"],
  },
  "malware-scan": {
    lines: ["M8 24 C24 25, 32 25, 48 24", "M48 24 C66 24, 74 24, 92 24", "M48 24 C48 46, 48 60, 72 82"],
    labels: ["Upload", "Scan", "Quarantine", "Approved"],
  },
  "workload-visibility": {
    lines: ["M8 25 C22 24, 34 24, 49 23", "M49 23 C63 23, 74 24, 92 25", "M49 23 C50 43, 50 62, 50 84"],
    labels: ["Work Items", "Pipelines", "Model", "Power BI"],
  },
  "aks-platform": {
    lines: ["M8 50 C26 45, 34 42, 49 30", "M49 30 C66 40, 76 46, 92 53", "M49 30 C49 52, 50 67, 74 82"],
    labels: ["Ingress", "Platform", "Namespaces", "Telemetry"],
  },
  "ai-rag": {
    lines: ["M8 24 C26 24, 34 24, 48 24", "M48 24 C63 24, 74 24, 92 24", "M48 24 C50 47, 53 66, 78 82"],
    labels: ["Ingestion", "Index", "Retrieval", "Model"],
  },
  "aiops-incident": {
    lines: ["M7 23 C21 24, 34 24, 47 23", "M47 23 C60 24, 74 24, 92 24", "M47 23 C48 45, 49 62, 74 83"],
    labels: ["Monitor", "Correlate", "AI Summary", "ITSM/DevOps"],
  },
  "aiops-aks": {
    lines: ["M8 52 C23 46, 34 40, 48 30", "M48 30 C62 39, 73 45, 92 53", "M48 30 C49 50, 52 65, 77 83"],
    labels: ["AKS Signals", "Anomaly", "Approval", "Runbooks"],
  },
};

export function ProjectTechnicalVisual({ project, compact = false }: ProjectTechnicalVisualProps) {
  const visual = visualMap[project.visualVariant];

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-white/12 bg-surface/75 ${compact ? "h-36" : "h-48"}`}
      aria-label={`Illustrative architecture visual for ${project.title}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(79,151,255,0.24),transparent_34%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-hidden="true">
        <g stroke="rgba(103,178,255,0.72)" strokeWidth="1.3" fill="none" strokeDasharray="3.4 4">
          {visual.lines.map((path) => (
            <path key={path} d={path} className="flow-line" />
          ))}
        </g>
        <circle cx="49" cy="24" r="2.6" fill="#8dc8ff" className="pulse-node" />
        <circle cx="92" cy="24" r="2.4" fill="#8dc8ff" className="pulse-node" />
        <circle cx="78" cy="82" r="2.4" fill="#8dc8ff" className="pulse-node" />
      </svg>

      <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
        {visual.labels.map((label) => (
          <span
            key={label}
            className="rounded-md border border-accent/25 bg-panel/85 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted"
          >
            {label}
          </span>
        ))}
      </div>

      <figcaption className="sr-only">{project.diagramAlt}</figcaption>
    </figure>
  );
}
