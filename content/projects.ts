export type ProjectItem = {
  slug: string;
  title: string;
  draft: true;
  visualVariant:
    | "landing-zone"
    | "cicd"
    | "malware-scan"
    | "workload-visibility"
    | "aks-platform"
    | "ai-rag"
    | "aiops-incident"
    | "aiops-aks";
  problem: string;
  architecture: string;
  designDecisions: string[];
  implementation: string[];
  security: string;
  tradeOffs: string[];
  verifiedOutcomes: string[];
  tags: string[];
  diagramAlt: string;
  githubUrl?: string;
  demoUrl?: string;
};

export const projects: ProjectItem[] = [
  {
    slug: "azure-landing-zone-iac-modules",
    title: "Azure Landing Zone and Terraform/OpenTofu Automation",
    draft: true,
    visualVariant: "landing-zone",
    problem:
      "Teams need consistent subscription onboarding and policy controls without duplicating infrastructure code.",
    architecture:
      "Draft architecture uses modular Terraform/OpenTofu components for management groups, policy assignments, networking, and baseline observability.",
    designDecisions: [
      "Use module composition over monolithic templates to support environment-specific policy layering.",
      "Separate governance controls from workload modules to keep policy updates independent.",
      "Adopt deterministic naming and tagging conventions for predictable onboarding automation.",
    ],
    implementation: [
      "Create reusable OpenTofu/Terraform modules for hierarchy, networking, policy assignment, and diagnostics.",
      "Define environment overlays to standardize defaults while allowing approved exceptions.",
      "Validate module behavior with plan checks before promotion to shared module registries.",
    ],
    security:
      "Draft security model applies least privilege, policy-as-code, and secure state management patterns.",
    tradeOffs: [
      "Stronger governance can slow edge-case onboarding when exceptions are not pre-modeled.",
      "Reusable modules increase consistency but require disciplined version management.",
    ],
    verifiedOutcomes: [
      "Draft: improved governance consistency across onboarding workflows.",
      "Draft: reduced manual configuration drift in platform baselines.",
    ],
    tags: ["Azure", "Terraform", "OpenTofu", "Governance"],
    diagramAlt: "Sanitized diagram of modular landing zone components and governance layers.",
  },
  {
    slug: "multi-environment-cicd-angular-dotnet-sql",
    title: "Multi-Environment CI/CD for Angular + .NET + SQL",
    draft: true,
    visualVariant: "cicd",
    problem:
      "Distributed teams require reliable release automation across dev, test, and production with clear approvals and rollback strategy.",
    architecture:
      "Draft architecture separates app, API, and database pipelines with promotion gates and environment controls.",
    designDecisions: [
      "Keep application and database release tracks coordinated but independently rollback-capable.",
      "Introduce environment promotion gates to reduce unsafe direct-to-production pushes.",
      "Use shared pipeline templates to enforce quality checks consistently.",
    ],
    implementation: [
      "Build reusable pipeline templates for Angular, .NET, and SQL deployment stages.",
      "Add validation gates for pull requests, package integrity, and deployment readiness.",
      "Implement release orchestration that promotes artifacts across environments with approvals.",
    ],
    security:
      "Draft security controls include secrets isolation, branch protections, and static analysis integration.",
    tradeOffs: [
      "Additional approval gates increase release confidence but can add cycle time.",
      "Template centralization improves standardization but requires stricter change governance.",
    ],
    verifiedOutcomes: [
      "Draft: stronger deployment traceability across environments.",
      "Draft: improved release reliability through repeatable quality gates.",
    ],
    tags: ["Azure DevOps", "CI/CD", ".NET", "SQL"],
    diagramAlt: "Sanitized flow from commit to staged multi-environment deployments.",
    demoUrl: "/demos/azure-devops-pipeline",
  },
  {
    slug: "aks-platform-engineering",
    title: "AKS Platform Engineering",
    draft: true,
    visualVariant: "aks-platform",
    problem:
      "Application squads need a secure, standardized Kubernetes platform with faster onboarding and operational guardrails.",
    architecture:
      "Draft architecture uses AKS, ingress patterns, workload identity, and centralized observability.",
    designDecisions: [
      "Use platform-level guardrails with team-level namespace autonomy.",
      "Prefer workload identity and policy enforcement for secure service integration.",
      "Adopt Helm-based golden paths for repeatable team onboarding.",
    ],
    implementation: [
      "Define namespace, ingress, and deployment standards for shared platform operations.",
      "Create onboarding templates for services, including observability and policy defaults.",
      "Integrate platform diagnostics and operational dashboards for incident triage.",
    ],
    security:
      "Draft security includes network segmentation, policy enforcement, and runtime scanning controls.",
    tradeOffs: [
      "Platform standards reduce variance but can limit unconventional workload patterns.",
      "Operational maturity requirements increase initial team onboarding effort.",
    ],
    verifiedOutcomes: [
      "Draft: improved consistency in Kubernetes deployment practices.",
      "Draft: clearer ownership boundaries between platform and product teams.",
    ],
    tags: ["AKS", "Kubernetes", "Helm", "Platform Engineering"],
    diagramAlt: "Sanitized AKS platform topology with shared services and tenant workloads.",
  },
  {
    slug: "blob-malware-scanning-defender-storage",
    title: "Azure Blob Malware Scanning with Defender for Storage",
    draft: true,
    visualVariant: "malware-scan",
    problem:
      "File ingestion pipelines need proactive malware detection before downstream processing.",
    architecture:
      "Draft architecture combines blob events, scanning workflows, and quarantine routing with secure notifications.",
    designDecisions: [
      "Separate quarantine and approved-object paths to avoid accidental downstream ingestion.",
      "Use event-driven orchestration for low-latency validation before processing.",
      "Retain auditable scan-state metadata for traceability.",
    ],
    implementation: [
      "Configure event triggers for blob uploads and scan-state updates.",
      "Route suspicious files to quarantine while preserving triage context.",
      "Integrate notification hooks for operational follow-up workflows.",
    ],
    security:
      "Draft security model includes encrypted storage, minimal access paths, and auditable incident handling.",
    tradeOffs: [
      "Early scanning improves safety but can add latency to ingestion pipelines.",
      "Strict quarantine policies reduce risk while increasing operational review volume.",
    ],
    verifiedOutcomes: [
      "Draft: improved containment posture for suspicious uploads.",
      "Draft: clearer governance path for handling potentially malicious objects.",
    ],
    tags: ["Azure Storage", "Defender for Cloud", "Security", "Event-Driven"],
    diagramAlt: "Sanitized storage security workflow with scan and quarantine branches.",
  },
  {
    slug: "azure-devops-workload-visibility-powerbi",
    title: "Azure DevOps Workload Visibility with Power BI",
    draft: true,
    visualVariant: "workload-visibility",
    problem:
      "Leadership requires clearer planning visibility and delivery signals across engineering initiatives.",
    architecture:
      "Draft architecture aggregates pipeline and work-item data into curated analytics models.",
    designDecisions: [
      "Separate operational and leadership reporting lenses for relevant decision support.",
      "Normalize delivery data to reduce inconsistent interpretation across teams.",
      "Apply role-based report access to avoid broad exposure of sensitive planning details.",
    ],
    implementation: [
      "Extract work-item and pipeline telemetry into curated analytics datasets.",
      "Define semantic models for capacity, throughput, and release-flow views.",
      "Publish dashboards with role-scoped access and scheduled refresh controls.",
    ],
    security:
      "Draft security controls include scoped dataset access and sanitized reporting boundaries.",
    tradeOffs: [
      "Centralized reporting improves consistency but requires ownership for data quality governance.",
      "Frequent refresh windows improve recency while increasing data pipeline load.",
    ],
    verifiedOutcomes: [
      "Draft: improved delivery visibility for planning and prioritization discussions.",
      "Draft: more consistent reporting language across engineering stakeholders.",
    ],
    tags: ["Azure DevOps", "Power BI", "Reporting", "Governance"],
    diagramAlt: "Sanitized analytics pipeline from delivery tools to executive dashboards.",
  },
  {
    slug: "azure-ai-rag-infrastructure",
    title: "Azure AI / RAG Infrastructure",
    draft: true,
    visualVariant: "ai-rag",
    problem:
      "Organizations exploring RAG require secure and governable infrastructure foundations before experimentation at scale.",
    architecture:
      "Draft architecture outlines ingestion, vector indexing, model access, and private networking controls.",
    designDecisions: [
      "Isolate ingestion, retrieval, and model-access boundaries to control data exposure.",
      "Prefer private networking and identity-scoped access for AI runtime services.",
      "Standardize observability signals early to support safe experimentation at scale.",
    ],
    implementation: [
      "Provision ingestion and indexing infrastructure with environment-level isolation.",
      "Configure retrieval and model-call pathways with controlled identity boundaries.",
      "Add monitoring and policy checks for model usage and data handling flows.",
    ],
    security:
      "Draft security includes identity boundaries, data handling controls, and auditability patterns.",
    tradeOffs: [
      "Stronger security controls can add complexity to initial prototyping speed.",
      "Isolated environments improve governance but increase operational overhead.",
    ],
    verifiedOutcomes: [
      "Draft: safer baseline for RAG experimentation under governance constraints.",
      "Draft: clearer separation of concerns across ingestion, indexing, and retrieval layers.",
    ],
    tags: ["Azure AI", "RAG", "Infrastructure", "Security"],
    diagramAlt: "Sanitized RAG infrastructure diagram showing ingestion, indexing, and retrieval flow.",
  },
  {
    slug: "azure-aiops-incident-intelligence",
    title: "Azure AIOps - Intelligent Incident Detection and Root Cause Analysis",
    draft: true,
    visualVariant: "aiops-incident",
    problem:
      "Operations teams need faster triage for noisy incidents across applications and infrastructure without relying on unsupported autonomous remediation claims.",
    architecture:
      "Reference architecture (proposed): Azure Monitor, Log Analytics, and Application Insights feed correlated signals into an Azure Functions orchestration layer. Azure OpenAI is used to generate operator-facing incident summaries and probable-cause hypotheses, with integration adapters for Azure DevOps or ServiceNow ticket workflows.",
    designDecisions: [
      "Use correlation-first incident grouping before AI summarization to reduce duplicate ticket noise.",
      "Keep AI outputs as advisory context for responders, not autonomous production actions.",
      "Route actionable incidents into existing Azure DevOps/ServiceNow processes to preserve governance and auditability.",
    ],
    implementation: [
      "Collect platform and application signals from Azure Monitor, Application Insights, and Log Analytics workspaces.",
      "Trigger Azure Functions workflows on threshold and pattern-based alerts for incident normalization.",
      "Generate draft summaries and probable-cause analysis with Azure OpenAI, then append them to incident records.",
      "Require human review/approval gates before any remediation runbook is invoked in production environments.",
    ],
    security:
      "Reference security model uses managed identity, least-privilege access to telemetry stores, prompt/input sanitization, and role-based access controls for incident tooling. AI-generated content is logged for traceability and reviewer accountability.",
    tradeOffs: [
      "Correlation quality depends on telemetry hygiene and standardized signal naming.",
      "AI summaries can improve triage speed but still require operator validation to avoid incorrect assumptions.",
      "Approval gates increase control and safety while adding response latency in urgent events.",
    ],
    verifiedOutcomes: [
      "Reference design for portfolio demonstration; no client production deployment claim.",
      "Draft: improved incident context packaging for human responders in triage workflows.",
      "Draft: consistent escalation path through Azure DevOps or ServiceNow integration patterns.",
    ],
    tags: ["AIOps", "Azure Monitor", "Log Analytics", "Application Insights", "Azure Functions", "Azure OpenAI"],
    diagramAlt:
      "Reference architecture diagram showing telemetry ingestion, AI-assisted incident analysis, and operational tool integration.",
    demoUrl: "/demos/aiops-incident-lab",
  },
  {
    slug: "aks-aiops-platform-reliability",
    title: "AIOps for AKS - Anomaly Detection and Platform Reliability",
    draft: true,
    visualVariant: "aiops-aks",
    problem:
      "Platform teams need earlier visibility into AKS anomalies and deployment risk while maintaining controlled remediation and operational governance.",
    architecture:
      "Reference architecture (proposed): AKS telemetry from Azure Monitor managed Prometheus, Grafana, Container Insights, and Log Analytics is aggregated into an analysis workflow. AI-assisted reasoning helps classify workload health and deployment-failure patterns, then proposes controlled next actions for human-approved remediation.",
    designDecisions: [
      "Combine metrics, logs, and events to avoid single-signal anomaly bias.",
      "Treat anomaly scoring as decision support; do not claim predictive certainty without validated models.",
      "Require operator checkpoints before production remediation to reduce unintended service impact.",
    ],
    implementation: [
      "Stream AKS telemetry from managed Prometheus, Container Insights, and Log Analytics.",
      "Apply anomaly-detection and failure-pattern rules for workload health and release regression signals.",
      "Generate AIOps incident briefs that include probable contributing factors and suggested runbook paths.",
      "Execute remediation only through controlled workflows with explicit human approval and rollback plans.",
    ],
    security:
      "Reference security controls include namespace-scoped access, role-based Grafana/monitoring permissions, managed identity for automation components, and audited approval trails for remediation actions.",
    tradeOffs: [
      "Higher observability depth improves diagnosis but increases signal volume and tuning effort.",
      "Conservative remediation controls reduce automation risk while limiting immediate hands-off recovery.",
      "Detection quality depends on baseline calibration and continuous review of false positives.",
    ],
    verifiedOutcomes: [
      "Reference design for portfolio demonstration; no production reliability metric claim.",
      "Draft: improved AKS incident triage context using combined metrics, logs, and deployment events.",
      "Draft: safer remediation posture through mandatory approval and rollback-oriented workflows.",
    ],
    tags: ["AIOps", "AKS", "Managed Prometheus", "Grafana", "Container Insights", "Reliability"],
    diagramAlt:
      "Proposed reference architecture for AKS AIOps anomaly analysis, operator review, and controlled remediation flows.",
    demoUrl: "/demos/aiops-incident-lab",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
