export type ArchitectureClassification = "reference" | "proposed" | "implemented_verified";
export type ConnectionDirection = "forward" | "bidirectional" | "event";

export type ArchitectureGroup = {
  id: string;
  label: string;
  toneClass: string;
};

export type ArchitectureNode = {
  id: string;
  label: string;
  kind: "azure" | "service" | "platform" | "security" | "data" | "external";
  groupId: string;
  x: number;
  y: number;
  purpose: string;
  responsibilities: string[];
  securityControls: string[];
  dependencies: string[];
  designDecisions: string[];
  annotations?: string[];
};

export type ArchitectureConnection = {
  id: string;
  from: string;
  to: string;
  direction: ConnectionDirection;
  label?: string;
  annotation?: string;
};

export type ArchitectureDiagram = {
  id: string;
  title: string;
  subtitle: string;
  classification: ArchitectureClassification;
  dataFlowDirection: string;
  groups: ArchitectureGroup[];
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  annotations?: string[];
};

const commonGroups: ArchitectureGroup[] = [
  { id: "ingress", label: "Ingress / Trigger", toneClass: "border-sky-300/45 bg-sky-500/10 text-sky-100" },
  { id: "orchestration", label: "Orchestration", toneClass: "border-accent/45 bg-accent/15 text-ink" },
  { id: "data", label: "Data / Storage", toneClass: "border-emerald-300/45 bg-emerald-500/12 text-emerald-100" },
  { id: "security", label: "Security", toneClass: "border-amber-300/45 bg-amber-500/12 text-amber-100" },
  { id: "observability", label: "Observability", toneClass: "border-violet-300/45 bg-violet-500/12 text-violet-100" },
  { id: "ops", label: "Operations", toneClass: "border-cyan-300/45 bg-cyan-500/12 text-cyan-100" },
];

const diagrams: ArchitectureDiagram[] = [
  {
    id: "azure-landing-zone-iac-modules",
    title: "Landing Zone / IaC",
    subtitle: "Sanitized modular governance and platform baseline.",
    classification: "proposed",
    dataFlowDirection: "Platform policy and network baselines propagate from governance layers to shared services and observability.",
    groups: commonGroups,
    nodes: [
      {
        id: "lz-mg",
        label: "Management Groups",
        kind: "platform",
        groupId: "orchestration",
        x: 10,
        y: 18,
        purpose: "Organize subscription hierarchy and governance inheritance.",
        responsibilities: ["Hierarchy control", "Policy scope boundaries"],
        securityControls: ["Least-privilege role assignments", "Policy inheritance governance"],
        dependencies: ["Policy Assignments"],
        designDecisions: ["Use modular hierarchy definitions to avoid monolithic platform templates."],
      },
      {
        id: "lz-policy",
        label: "Policy Assignments",
        kind: "security",
        groupId: "security",
        x: 34,
        y: 18,
        purpose: "Apply baseline controls for resource compliance and guardrails.",
        responsibilities: ["Policy initiatives", "Compliance enforcement"],
        securityControls: ["Deny non-compliant resources", "Audit effects for staged rollout"],
        dependencies: ["Management Groups"],
        designDecisions: ["Separate policy modules for independent lifecycle and approvals."],
      },
      {
        id: "lz-network",
        label: "Shared Networking",
        kind: "azure",
        groupId: "ingress",
        x: 58,
        y: 18,
        purpose: "Provide standardized connectivity and perimeter controls.",
        responsibilities: ["Routing baseline", "Private connectivity patterns"],
        securityControls: ["Network segmentation", "Approved ingress paths"],
        dependencies: ["Policy Assignments"],
        designDecisions: ["Keep networking module reusable across workload subscriptions."],
      },
      {
        id: "lz-obsv",
        label: "Diagnostics Workspace",
        kind: "data",
        groupId: "observability",
        x: 80,
        y: 44,
        purpose: "Centralize platform diagnostics for governance review.",
        responsibilities: ["Log collection", "Operational signals"],
        securityControls: ["RBAC-scoped access", "Sanitized diagnostics exports"],
        dependencies: ["Shared Networking"],
        designDecisions: ["Collect baseline observability at platform level before team onboarding."],
      },
      {
        id: "lz-workloads",
        label: "Workload Subscriptions",
        kind: "external",
        groupId: "ops",
        x: 58,
        y: 68,
        purpose: "Host product workloads within pre-approved controls.",
        responsibilities: ["Workload deployment", "Team ownership boundaries"],
        securityControls: ["Policy inheritance", "Tagging and logging defaults"],
        dependencies: ["Shared Networking", "Diagnostics Workspace"],
        designDecisions: ["Enable team autonomy while retaining central governance guardrails."],
      },
    ],
    connections: [
      { id: "c1", from: "lz-mg", to: "lz-policy", direction: "forward", label: "governance scope" },
      { id: "c2", from: "lz-policy", to: "lz-network", direction: "forward", label: "policy baseline" },
      { id: "c3", from: "lz-network", to: "lz-workloads", direction: "forward", label: "shared connectivity" },
      { id: "c4", from: "lz-network", to: "lz-obsv", direction: "forward", label: "diagnostic routing" },
      { id: "c5", from: "lz-workloads", to: "lz-obsv", direction: "event", label: "platform telemetry" },
    ],
    annotations: ["Reference diagram uses generic naming only.", "No tenant, subscription, or private network details included."],
  },
  {
    id: "multi-environment-cicd-angular-dotnet-sql",
    title: "Multi-Environment CI/CD",
    subtitle: "Controlled promotion with quality, security, and approval gates.",
    classification: "implemented_verified",
    dataFlowDirection: "Source commit flows through build and gating stages, then promotes across environments with approval checkpoints.",
    groups: commonGroups,
    nodes: [
      {
        id: "ci-source",
        label: "Source Repository",
        kind: "external",
        groupId: "ingress",
        x: 8,
        y: 22,
        purpose: "Stores application and infrastructure code.",
        responsibilities: ["Version history", "Pull request trigger"],
        securityControls: ["Branch protection", "Review requirements"],
        dependencies: ["Pipeline Orchestrator"],
        designDecisions: ["Template-driven repository standards for repeatable delivery."],
      },
      {
        id: "ci-pipeline",
        label: "Pipeline Orchestrator",
        kind: "platform",
        groupId: "orchestration",
        x: 30,
        y: 22,
        purpose: "Runs build, test, release, and rollback workflow logic.",
        responsibilities: ["Build steps", "Stage coordination"],
        securityControls: ["Scoped service connections", "Audited deployment approvals"],
        dependencies: ["Source Repository", "Quality/Security Gates"],
        designDecisions: ["Independent application and database release tracks with controlled promotion."],
      },
      {
        id: "ci-gates",
        label: "Quality/Security Gates",
        kind: "security",
        groupId: "security",
        x: 52,
        y: 22,
        purpose: "Validate artifacts before environment promotion.",
        responsibilities: ["Test quality checks", "Security scanning"],
        securityControls: ["Fail-fast policy checks", "Artifact integrity verification"],
        dependencies: ["Pipeline Orchestrator"],
        designDecisions: ["Uniform quality controls via reusable templates."],
      },
      {
        id: "ci-app",
        label: "App Runtime",
        kind: "azure",
        groupId: "ops",
        x: 76,
        y: 22,
        purpose: "Hosts staged application deployment targets.",
        responsibilities: ["Environment rollout", "Health validation"],
        securityControls: ["Environment-scoped credentials", "Approval gates before production"],
        dependencies: ["Quality/Security Gates", "Database Runtime"],
        designDecisions: ["Promotion model from dev to UAT to production with explicit controls."],
      },
      {
        id: "ci-db",
        label: "Database Runtime",
        kind: "data",
        groupId: "data",
        x: 76,
        y: 58,
        purpose: "Supports controlled schema and data-change deployments.",
        responsibilities: ["Schema migration", "Release validation"],
        securityControls: ["Least privilege DB deploy identity", "Backup/rollback readiness"],
        dependencies: ["Pipeline Orchestrator"],
        designDecisions: ["Coordinate DB deployment lifecycle with app release gates."],
      },
    ],
    connections: [
      { id: "c1", from: "ci-source", to: "ci-pipeline", direction: "event", label: "commit trigger" },
      { id: "c2", from: "ci-pipeline", to: "ci-gates", direction: "forward", label: "validation" },
      { id: "c3", from: "ci-gates", to: "ci-app", direction: "forward", label: "promotion" },
      { id: "c4", from: "ci-pipeline", to: "ci-db", direction: "forward", label: "db release track" },
      { id: "c5", from: "ci-app", to: "ci-db", direction: "bidirectional", label: "runtime dependency" },
    ],
  },
  {
    id: "aks-platform-engineering",
    title: "AKS Platform Engineering",
    subtitle: "Standardized platform foundations with team namespace autonomy.",
    classification: "proposed",
    dataFlowDirection: "Ingress and platform controls route traffic to tenant namespaces while shared telemetry captures platform health.",
    groups: commonGroups,
    nodes: [
      {
        id: "aks-ingress",
        label: "Ingress Layer",
        kind: "azure",
        groupId: "ingress",
        x: 10,
        y: 24,
        purpose: "Entry point for workload traffic.",
        responsibilities: ["Routing", "Ingress policy"],
        securityControls: ["Controlled ingress rules"],
        dependencies: ["AKS Platform Core"],
        designDecisions: ["Enforce consistent ingress patterns across product teams."],
      },
      {
        id: "aks-core",
        label: "AKS Platform Core",
        kind: "platform",
        groupId: "orchestration",
        x: 36,
        y: 24,
        purpose: "Hosts shared platform services and scheduling controls.",
        responsibilities: ["Cluster operations", "Policy baseline"],
        securityControls: ["Policy enforcement", "Workload identity usage"],
        dependencies: ["Tenant Namespaces", "Platform Telemetry"],
        designDecisions: ["Separate platform responsibilities from product workload ownership."],
      },
      {
        id: "aks-ns",
        label: "Tenant Namespaces",
        kind: "service",
        groupId: "ops",
        x: 64,
        y: 24,
        purpose: "Provide bounded autonomy for workload squads.",
        responsibilities: ["Service deployment", "Namespace policies"],
        securityControls: ["Namespace-scoped RBAC", "Quota controls"],
        dependencies: ["AKS Platform Core", "Secrets Store"],
        designDecisions: ["Golden paths with namespace-level autonomy and guardrails."],
      },
      {
        id: "aks-kv",
        label: "Secrets Store",
        kind: "security",
        groupId: "security",
        x: 64,
        y: 58,
        purpose: "Provide controlled access to runtime secrets.",
        responsibilities: ["Secret retrieval", "Credential governance"],
        securityControls: ["Managed identity access", "Access policy boundaries"],
        dependencies: ["AKS Platform Core"],
        designDecisions: ["Prefer identity-driven secret access over embedded credentials."],
      },
      {
        id: "aks-obsv",
        label: "Platform Telemetry",
        kind: "data",
        groupId: "observability",
        x: 38,
        y: 58,
        purpose: "Capture cluster and workload operational signals.",
        responsibilities: ["Logs and metrics", "Incident triage context"],
        securityControls: ["Role-scoped dashboards"],
        dependencies: ["AKS Platform Core", "Tenant Namespaces"],
        designDecisions: ["Central observability for faster cross-team triage."],
      },
    ],
    connections: [
      { id: "c1", from: "aks-ingress", to: "aks-core", direction: "forward", label: "traffic" },
      { id: "c2", from: "aks-core", to: "aks-ns", direction: "forward", label: "scheduling" },
      { id: "c3", from: "aks-core", to: "aks-obsv", direction: "event", label: "platform signals" },
      { id: "c4", from: "aks-ns", to: "aks-obsv", direction: "event", label: "workload signals" },
      { id: "c5", from: "aks-kv", to: "aks-ns", direction: "forward", label: "secret material" },
    ],
  },
  {
    id: "blob-malware-scanning-defender-storage",
    title: "Malware Scanning",
    subtitle: "Event-driven file validation with controlled quarantine branch.",
    classification: "reference",
    dataFlowDirection: "Upload events split into scan outcomes, routing suspicious objects to quarantine and approved content to downstream processing.",
    groups: commonGroups,
    nodes: [
      {
        id: "mw-upload",
        label: "Upload Endpoint",
        kind: "external",
        groupId: "ingress",
        x: 8,
        y: 24,
        purpose: "Accept inbound file submissions for validation.",
        responsibilities: ["Ingestion trigger", "Object intake"],
        securityControls: ["Authenticated upload path", "Transport security"],
        dependencies: ["Blob Landing"],
        designDecisions: ["Separate upload from downstream processing until scan verdict is known."],
      },
      {
        id: "mw-blob",
        label: "Blob Landing",
        kind: "data",
        groupId: "data",
        x: 28,
        y: 24,
        purpose: "Temporary landing area for uploaded files.",
        responsibilities: ["Object staging", "Scan event emission"],
        securityControls: ["Encrypted storage", "Scoped access identities"],
        dependencies: ["Scan Orchestrator"],
        designDecisions: ["Use isolated landing zone before release to trusted storage paths."],
      },
      {
        id: "mw-scan",
        label: "Scan Orchestrator",
        kind: "platform",
        groupId: "orchestration",
        x: 50,
        y: 24,
        purpose: "Correlate scan results and route files by verdict.",
        responsibilities: ["Event handling", "Routing decisions"],
        securityControls: ["Audit logs", "Deterministic routing rules"],
        dependencies: ["Approved Store", "Quarantine Store"],
        designDecisions: ["Keep quarantine path explicit for containment and review."],
      },
      {
        id: "mw-approved",
        label: "Approved Store",
        kind: "data",
        groupId: "ops",
        x: 76,
        y: 16,
        purpose: "Hold files cleared for downstream processing.",
        responsibilities: ["Trusted object path"],
        securityControls: ["Least privilege read access"],
        dependencies: ["Scan Orchestrator"],
        designDecisions: ["Only verified files progress to processing workloads."],
      },
      {
        id: "mw-quarantine",
        label: "Quarantine Store",
        kind: "security",
        groupId: "security",
        x: 76,
        y: 40,
        purpose: "Contain suspicious or failing scan objects.",
        responsibilities: ["Isolation", "Security triage"],
        securityControls: ["Restricted access", "Alerting hooks"],
        dependencies: ["Scan Orchestrator", "Ops Notification"],
        designDecisions: ["Quarantine branch prioritizes safety over processing speed."],
      },
      {
        id: "mw-notify",
        label: "Ops Notification",
        kind: "service",
        groupId: "observability",
        x: 50,
        y: 58,
        purpose: "Notify responders when quarantine events occur.",
        responsibilities: ["Event notification", "Review workflow signal"],
        securityControls: ["Sanitized event payloads"],
        dependencies: ["Quarantine Store"],
        designDecisions: ["Attach incident context to reduce analyst triage effort."],
      },
    ],
    connections: [
      { id: "c1", from: "mw-upload", to: "mw-blob", direction: "forward", label: "upload" },
      { id: "c2", from: "mw-blob", to: "mw-scan", direction: "event", label: "scan trigger" },
      { id: "c3", from: "mw-scan", to: "mw-approved", direction: "forward", label: "clean verdict" },
      { id: "c4", from: "mw-scan", to: "mw-quarantine", direction: "forward", label: "suspicious verdict" },
      { id: "c5", from: "mw-quarantine", to: "mw-notify", direction: "event", label: "incident signal" },
    ],
  },
  {
    id: "azure-devops-workload-visibility-powerbi",
    title: "Workload Visibility",
    subtitle: "Delivery telemetry aggregation into curated analytics views.",
    classification: "reference",
    dataFlowDirection: "Planning and delivery signals are normalized into semantic models and visualized through role-scoped dashboards.",
    groups: commonGroups,
    nodes: [
      {
        id: "wv-work",
        label: "Work Tracking Data",
        kind: "external",
        groupId: "ingress",
        x: 10,
        y: 22,
        purpose: "Capture backlog and planning signals.",
        responsibilities: ["Work item history", "Planning data"],
        securityControls: ["Read-scope enforcement"],
        dependencies: ["Analytics Model"],
        designDecisions: ["Separate planning lens from operations telemetry."],
      },
      {
        id: "wv-pipe",
        label: "Pipeline Telemetry",
        kind: "external",
        groupId: "ingress",
        x: 10,
        y: 52,
        purpose: "Capture release and build execution data.",
        responsibilities: ["Pipeline status", "Release timing"],
        securityControls: ["Token scope controls"],
        dependencies: ["Analytics Model"],
        designDecisions: ["Normalize varying pipeline data into common dimensions."],
      },
      {
        id: "wv-model",
        label: "Analytics Model",
        kind: "data",
        groupId: "orchestration",
        x: 42,
        y: 36,
        purpose: "Curate and model delivery data for consistent reporting.",
        responsibilities: ["Data shaping", "Metric definitions"],
        securityControls: ["Data sanitization", "Role-aware views"],
        dependencies: ["Executive Dashboard"],
        designDecisions: ["Semantic model keeps KPI definitions consistent across audiences."],
      },
      {
        id: "wv-bi",
        label: "Executive Dashboard",
        kind: "service",
        groupId: "ops",
        x: 74,
        y: 36,
        purpose: "Visualize throughput, capacity, and release trends.",
        responsibilities: ["Reporting", "Decision support"],
        securityControls: ["Role-based dashboard access"],
        dependencies: ["Analytics Model"],
        designDecisions: ["Provide separate operational and leadership dashboard views."],
      },
    ],
    connections: [
      { id: "c1", from: "wv-work", to: "wv-model", direction: "event", label: "planning data" },
      { id: "c2", from: "wv-pipe", to: "wv-model", direction: "event", label: "delivery data" },
      { id: "c3", from: "wv-model", to: "wv-bi", direction: "forward", label: "curated metrics" },
    ],
  },
  {
    id: "azure-ai-rag-infrastructure",
    title: "RAG Infrastructure",
    subtitle: "Governed ingestion, indexing, retrieval, and model response path.",
    classification: "proposed",
    dataFlowDirection: "Curated content ingests into indexing, retrieval enriches prompts, and response generation occurs through controlled model access.",
    groups: commonGroups,
    nodes: [
      {
        id: "rag-ingest",
        label: "Document Ingestion",
        kind: "service",
        groupId: "ingress",
        x: 8,
        y: 22,
        purpose: "Collect and normalize content for retrieval use.",
        responsibilities: ["Parsing", "Chunk preparation"],
        securityControls: ["Input sanitization", "Content access filtering"],
        dependencies: ["Vector Index"],
        designDecisions: ["Keep ingestion isolated from model runtime surface."],
      },
      {
        id: "rag-index",
        label: "Vector Index",
        kind: "data",
        groupId: "data",
        x: 32,
        y: 22,
        purpose: "Store vectorized content for similarity retrieval.",
        responsibilities: ["Index maintenance", "Retrieval support"],
        securityControls: ["Scoped index access", "Data lifecycle controls"],
        dependencies: ["Retrieval Layer"],
        designDecisions: ["Decouple retrieval index from raw document sources."],
      },
      {
        id: "rag-ret",
        label: "Retrieval Layer",
        kind: "platform",
        groupId: "orchestration",
        x: 56,
        y: 22,
        purpose: "Resolve user query context before model inference.",
        responsibilities: ["Similarity search", "Prompt assembly"],
        securityControls: ["Query filtering", "Result scope boundaries"],
        dependencies: ["Model Endpoint", "Guardrails"],
        designDecisions: ["Use explicit retrieval-to-prompt boundary for traceability."],
      },
      {
        id: "rag-model",
        label: "Model Endpoint",
        kind: "azure",
        groupId: "ops",
        x: 80,
        y: 22,
        purpose: "Generate responses from curated prompt context.",
        responsibilities: ["Inference", "Response output"],
        securityControls: ["Private endpoint patterns", "Identity-based access"],
        dependencies: ["Response Logging"],
        designDecisions: ["Model access remains controlled and auditable."],
      },
      {
        id: "rag-guard",
        label: "Guardrails",
        kind: "security",
        groupId: "security",
        x: 56,
        y: 56,
        purpose: "Apply policy checks before and after inference.",
        responsibilities: ["Prompt checks", "Output moderation"],
        securityControls: ["Policy validation", "Prompt/output filtering"],
        dependencies: ["Retrieval Layer", "Model Endpoint"],
        designDecisions: ["Treat guardrails as mandatory control point, not optional plugin."],
      },
      {
        id: "rag-obs",
        label: "Response Logging",
        kind: "data",
        groupId: "observability",
        x: 80,
        y: 56,
        purpose: "Capture usage and diagnostics for governance.",
        responsibilities: ["Audit traces", "Evaluation dataset signals"],
        securityControls: ["Sanitized logging", "Role-scoped read access"],
        dependencies: ["Model Endpoint"],
        designDecisions: ["Collect observability from first iteration to support safe experimentation."],
      },
    ],
    connections: [
      { id: "c1", from: "rag-ingest", to: "rag-index", direction: "forward", label: "content flow" },
      { id: "c2", from: "rag-index", to: "rag-ret", direction: "forward", label: "retrieval" },
      { id: "c3", from: "rag-ret", to: "rag-model", direction: "forward", label: "prompt context" },
      { id: "c4", from: "rag-ret", to: "rag-guard", direction: "forward", label: "policy check" },
      { id: "c5", from: "rag-guard", to: "rag-model", direction: "forward", label: "approved prompt" },
      { id: "c6", from: "rag-model", to: "rag-obs", direction: "event", label: "response telemetry" },
    ],
  },
  {
    id: "azure-aiops-incident-intelligence",
    title: "AIOps Incident Intelligence",
    subtitle: "Correlated telemetry with advisory probable-cause context.",
    classification: "reference",
    dataFlowDirection: "Telemetry events correlate into incidents, advisory AI summaries enrich context, and responders approve actions.",
    groups: commonGroups,
    nodes: [
      {
        id: "io-monitor",
        label: "Azure Monitor Signals",
        kind: "azure",
        groupId: "ingress",
        x: 8,
        y: 22,
        purpose: "Collect infrastructure and service metrics.",
        responsibilities: ["Metric stream", "Alert triggers"],
        securityControls: ["Read-scoped telemetry identities"],
        dependencies: ["Incident Correlation"],
        designDecisions: ["Correlation first to reduce duplicate incident noise."],
      },
      {
        id: "io-logs",
        label: "Log and App Signals",
        kind: "data",
        groupId: "observability",
        x: 8,
        y: 52,
        purpose: "Provide supporting log and dependency context.",
        responsibilities: ["Log context", "Trace anomalies"],
        securityControls: ["Workspace access boundaries"],
        dependencies: ["Incident Correlation"],
        designDecisions: ["Blend metrics and logs to improve triage confidence."],
      },
      {
        id: "io-corr",
        label: "Incident Correlation",
        kind: "platform",
        groupId: "orchestration",
        x: 38,
        y: 36,
        purpose: "Normalize and group related alerts before escalation.",
        responsibilities: ["Signal grouping", "Incident normalization"],
        securityControls: ["Auditable correlation rules"],
        dependencies: ["Advisory Summary", "Incident Workflow"],
        designDecisions: ["Keep deterministic rule logic transparent for operators."],
      },
      {
        id: "io-ai",
        label: "Advisory Summary",
        kind: "service",
        groupId: "ops",
        x: 62,
        y: 22,
        purpose: "Draft probable-cause explanations for responder review.",
        responsibilities: ["Summary generation", "Hypothesis suggestions"],
        securityControls: ["Prompt sanitization", "Human verification requirement"],
        dependencies: ["Incident Correlation"],
        designDecisions: ["AI output is advisory context, not autonomous remediation."],
        annotations: ["AI narrative is mock/advisory in this portfolio context."],
      },
      {
        id: "io-itsm",
        label: "Incident Workflow",
        kind: "external",
        groupId: "ops",
        x: 82,
        y: 36,
        purpose: "Track assignment, approval, and closure workflow.",
        responsibilities: ["Ticket lifecycle", "Approval checkpoints"],
        securityControls: ["Role-based incident actions"],
        dependencies: ["Incident Correlation", "Advisory Summary"],
        designDecisions: ["Keep human approval gates before remediation execution."],
      },
    ],
    connections: [
      { id: "c1", from: "io-monitor", to: "io-corr", direction: "event", label: "alert signals" },
      { id: "c2", from: "io-logs", to: "io-corr", direction: "event", label: "context signals" },
      { id: "c3", from: "io-corr", to: "io-ai", direction: "forward", label: "incident context" },
      { id: "c4", from: "io-corr", to: "io-itsm", direction: "forward", label: "ticket payload" },
      { id: "c5", from: "io-ai", to: "io-itsm", direction: "forward", label: "advisory summary" },
    ],
  },
  {
    id: "aks-aiops-platform-reliability",
    title: "AKS AIOps Reliability",
    subtitle: "Anomaly detection with controlled remediation workflow.",
    classification: "proposed",
    dataFlowDirection: "AKS runtime signals feed anomaly analysis and recommendation workflows, then human-approved remediation executes runbooks.",
    groups: commonGroups,
    nodes: [
      {
        id: "ar-signals",
        label: "AKS Runtime Signals",
        kind: "azure",
        groupId: "ingress",
        x: 8,
        y: 22,
        purpose: "Collect workload, node, and deployment telemetry.",
        responsibilities: ["Metrics stream", "Deployment event intake"],
        securityControls: ["Namespace-scoped telemetry access"],
        dependencies: ["Anomaly Analyzer"],
        designDecisions: ["Multi-signal observability to reduce single-metric bias."],
      },
      {
        id: "ar-obsv",
        label: "Observability Stack",
        kind: "data",
        groupId: "observability",
        x: 30,
        y: 22,
        purpose: "Aggregate metrics, logs, and traces for analysis.",
        responsibilities: ["Signal retention", "Operator dashboards"],
        securityControls: ["Role-scoped dashboard access"],
        dependencies: ["Anomaly Analyzer"],
        designDecisions: ["Keep observability baseline centralized for platform reliability triage."],
      },
      {
        id: "ar-anomaly",
        label: "Anomaly Analyzer",
        kind: "platform",
        groupId: "orchestration",
        x: 52,
        y: 22,
        purpose: "Detect and classify workload reliability anomalies.",
        responsibilities: ["Pattern matching", "Failure classification"],
        securityControls: ["Transparent scoring rules", "Auditable detections"],
        dependencies: ["AIOps Brief", "Runbook Controls"],
        designDecisions: ["Treat anomaly detection as decision support, not predictive certainty."],
      },
      {
        id: "ar-brief",
        label: "AIOps Brief",
        kind: "service",
        groupId: "ops",
        x: 74,
        y: 22,
        purpose: "Summarize probable causes and recommended actions.",
        responsibilities: ["Responder brief", "Suggested next actions"],
        securityControls: ["Sanitized advisory context"],
        dependencies: ["Anomaly Analyzer"],
        designDecisions: ["Provide recommendations while preserving operator decision authority."],
      },
      {
        id: "ar-runbook",
        label: "Runbook Controls",
        kind: "security",
        groupId: "security",
        x: 74,
        y: 58,
        purpose: "Execute approved remediation and rollback procedures.",
        responsibilities: ["Approval checkpoint", "Controlled execution"],
        securityControls: ["Explicit human approval", "Rollback-first guardrails"],
        dependencies: ["Anomaly Analyzer", "AIOps Brief"],
        designDecisions: ["Mandatory approval gates reduce unintended automated impact."],
      },
    ],
    connections: [
      { id: "c1", from: "ar-signals", to: "ar-obsv", direction: "event", label: "signal ingestion" },
      { id: "c2", from: "ar-obsv", to: "ar-anomaly", direction: "forward", label: "analysis stream" },
      { id: "c3", from: "ar-anomaly", to: "ar-brief", direction: "forward", label: "insight output" },
      { id: "c4", from: "ar-anomaly", to: "ar-runbook", direction: "forward", label: "recommended action" },
      { id: "c5", from: "ar-brief", to: "ar-runbook", direction: "forward", label: "operator context" },
    ],
  },
  {
    id: "demo-azure-devops-pipeline",
    title: "Demo: Release Pipeline",
    subtitle: "Local deterministic simulation for release stages and approvals.",
    classification: "implemented_verified",
    dataFlowDirection: "Local simulation executes stage progression from source through quality gates and staged release targets.",
    groups: commonGroups,
    nodes: [
      {
        id: "dp-source",
        label: "Git Source",
        kind: "external",
        groupId: "ingress",
        x: 8,
        y: 22,
        purpose: "Simulation source trigger and artifact origin.",
        responsibilities: ["Commit trigger", "Source baseline"],
        securityControls: ["Branch and review controls"],
        dependencies: ["Pipeline Engine"],
        designDecisions: ["Use deterministic local state transitions for reproducible demo behavior."],
      },
      {
        id: "dp-engine",
        label: "Pipeline Engine",
        kind: "platform",
        groupId: "orchestration",
        x: 30,
        y: 22,
        purpose: "Executes build, test, approval, and rollback flow.",
        responsibilities: ["Stage orchestration", "Failure handling"],
        securityControls: ["Manual production approval step"],
        dependencies: ["Quality Gates", "Runtime Target", "Data Target"],
        designDecisions: ["Maintain explicit approval gates before higher-risk rollout transitions."],
      },
      {
        id: "dp-gates",
        label: "Quality and Security Gates",
        kind: "security",
        groupId: "security",
        x: 54,
        y: 22,
        purpose: "Block promotion when validation fails.",
        responsibilities: ["Quality checks", "Security checks"],
        securityControls: ["Gate failure stop conditions"],
        dependencies: ["Pipeline Engine"],
        designDecisions: ["Test and security outcomes are first-class release controls."],
      },
      {
        id: "dp-app",
        label: "App Runtime",
        kind: "azure",
        groupId: "ops",
        x: 80,
        y: 22,
        purpose: "Represents staged deployment targets.",
        responsibilities: ["Environment rollout", "Health checks"],
        securityControls: ["Environment-scoped deployment identity"],
        dependencies: ["Pipeline Engine"],
        designDecisions: ["Promotion path includes UAT and production checkpoints."],
      },
      {
        id: "dp-sql",
        label: "Data Runtime",
        kind: "data",
        groupId: "data",
        x: 80,
        y: 58,
        purpose: "Represents controlled database release path.",
        responsibilities: ["Schema deployment", "Rollback support"],
        securityControls: ["Scoped database release credentials"],
        dependencies: ["Pipeline Engine"],
        designDecisions: ["Coordinate application and data release states."],
      },
    ],
    connections: [
      { id: "c1", from: "dp-source", to: "dp-engine", direction: "event", label: "pipeline trigger" },
      { id: "c2", from: "dp-engine", to: "dp-gates", direction: "forward", label: "stage checks" },
      { id: "c3", from: "dp-gates", to: "dp-app", direction: "forward", label: "approved release" },
      { id: "c4", from: "dp-engine", to: "dp-sql", direction: "forward", label: "data release" },
    ],
  },
  {
    id: "demo-aiops-incident-lab",
    title: "Demo: AIOps Incident Lab",
    subtitle: "Synthetic telemetry and deterministic incident correlation.",
    classification: "implemented_verified",
    dataFlowDirection: "Synthetic telemetry correlates into incident hypotheses, then approved remediation workflow advances lifecycle state.",
    groups: commonGroups,
    nodes: [
      {
        id: "da-telemetry",
        label: "Synthetic Telemetry",
        kind: "external",
        groupId: "ingress",
        x: 10,
        y: 24,
        purpose: "Generate reproducible event streams for scenarios.",
        responsibilities: ["Logs/metrics generation", "Scenario shaping"],
        securityControls: ["No real customer data", "No live environment calls"],
        dependencies: ["Correlation Rules"],
        designDecisions: ["Synthetic datasets keep the demo safe and deterministic."],
      },
      {
        id: "da-corr",
        label: "Correlation Rules",
        kind: "platform",
        groupId: "orchestration",
        x: 36,
        y: 24,
        purpose: "Map incident signals to probable-cause patterns.",
        responsibilities: ["Rule matching", "Evidence linking"],
        securityControls: ["Explicit, inspectable rule logic"],
        dependencies: ["Cause Panel", "Lifecycle Workflow"],
        designDecisions: ["Deterministic rule evaluation improves explainability."],
      },
      {
        id: "da-cause",
        label: "Cause Panel",
        kind: "service",
        groupId: "ops",
        x: 60,
        y: 24,
        purpose: "Present explainable evidence, confidence boundaries, and alternatives.",
        responsibilities: ["Incident context", "Responder decision support"],
        securityControls: ["Advisory output labeling"],
        dependencies: ["Correlation Rules"],
        designDecisions: ["Clearly separate advisory reasoning from autonomous action."],
      },
      {
        id: "da-remed",
        label: "Remediation Approval",
        kind: "security",
        groupId: "security",
        x: 82,
        y: 24,
        purpose: "Gate simulated remediation actions behind explicit approval.",
        responsibilities: ["Approval checkpoint", "Execution gate"],
        securityControls: ["Human-in-the-loop controls"],
        dependencies: ["Lifecycle Workflow"],
        designDecisions: ["No automatic remediation without approval."],
      },
      {
        id: "da-life",
        label: "Lifecycle Workflow",
        kind: "data",
        groupId: "observability",
        x: 60,
        y: 58,
        purpose: "Track state from new to closed with timeline notes.",
        responsibilities: ["State transitions", "Timeline logging"],
        securityControls: ["Auditable lifecycle events"],
        dependencies: ["Correlation Rules", "Remediation Approval"],
        designDecisions: ["Lifecycle controls enforce disciplined incident handling."],
      },
    ],
    connections: [
      { id: "c1", from: "da-telemetry", to: "da-corr", direction: "event", label: "scenario signals" },
      { id: "c2", from: "da-corr", to: "da-cause", direction: "forward", label: "probable cause" },
      { id: "c3", from: "da-corr", to: "da-life", direction: "forward", label: "incident state" },
      { id: "c4", from: "da-cause", to: "da-remed", direction: "forward", label: "recommended action" },
      { id: "c5", from: "da-remed", to: "da-life", direction: "event", label: "approval event" },
    ],
  },
];

const diagramMap = new Map(diagrams.map((diagram) => [diagram.id, diagram]));

export function getArchitectureDiagram(id: string): ArchitectureDiagram | undefined {
  return diagramMap.get(id);
}

export function getAllArchitectureDiagrams(): ArchitectureDiagram[] {
  return diagrams;
}

export function getClassificationLabel(classification: ArchitectureClassification): string {
  switch (classification) {
    case "reference":
      return "Reference";
    case "proposed":
      return "Proposed";
    case "implemented_verified":
      return "Implemented and verified";
    default:
      return "Reference";
  }
}

export type DiagramValidationResult = {
  id: string;
  valid: boolean;
  errors: string[];
};

const forbiddenPattern = /(subscription\s*id|tenant\s*id|10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.|customer\s*data|production\s*topology)/i;

export function validateDiagramData(diagram: ArchitectureDiagram): DiagramValidationResult {
  const errors: string[] = [];

  if (diagram.nodes.length === 0) {
    errors.push("Diagram must include at least one node.");
  }

  const nodeIds = new Set<string>();
  for (const node of diagram.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node id '${node.id}'.`);
    }
    nodeIds.add(node.id);

    if (node.x < 0 || node.x > 100 || node.y < 0 || node.y > 100) {
      errors.push(`Node '${node.id}' coordinates must be within 0..100.`);
    }

    if (!diagram.groups.some((group) => group.id === node.groupId)) {
      errors.push(`Node '${node.id}' references unknown group '${node.groupId}'.`);
    }

    if (forbiddenPattern.test(node.label) || forbiddenPattern.test(node.purpose)) {
      errors.push(`Node '${node.id}' appears to include non-sanitized content.`);
    }
  }

  const connectionIds = new Set<string>();
  for (const connection of diagram.connections) {
    if (connectionIds.has(connection.id)) {
      errors.push(`Duplicate connection id '${connection.id}'.`);
    }
    connectionIds.add(connection.id);

    if (!nodeIds.has(connection.from) || !nodeIds.has(connection.to)) {
      errors.push(`Connection '${connection.id}' references missing node(s).`);
    }

    if (connection.label && forbiddenPattern.test(connection.label)) {
      errors.push(`Connection '${connection.id}' contains non-sanitized label text.`);
    }
  }

  return {
    id: diagram.id,
    valid: errors.length === 0,
    errors,
  };
}

export function validateAllDiagrams(): DiagramValidationResult[] {
  return diagrams.map(validateDiagramData);
}
