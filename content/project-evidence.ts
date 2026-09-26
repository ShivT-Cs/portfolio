import type { ProjectItem } from "./projects";
import {
  getArchitectureDiagram,
  getClassificationLabel,
  type ArchitectureClassification,
} from "../lib/architecture-explorer-data";

export type EvidenceClassification = "implemented_demo" | "reference_architecture" | "production_verified";

export type EvidenceFileArtifact = {
  path: string;
  module: string;
  status: "implemented" | "pending";
};

export type EvidenceRouteArtifact = {
  route: string;
  label: string;
};

export type EvidenceTestArtifact = {
  path: string;
  scope: string;
};

export type TestRunSummary = {
  command: string;
  date: string;
  result: "passed" | "failed" | "pending";
  totalTests?: number;
  passedTests?: number;
  failedTests?: number;
  details: string;
};

export type ProjectEvidence = {
  slug: ProjectItem["slug"];
  classification: EvidenceClassification;
  implementedFiles: EvidenceFileArtifact[];
  demoRoutes: EvidenceRouteArtifact[];
  diagramId: string;
  diagramClassification: ArchitectureClassification;
  sanitizedDataFlow: string;
  automatedTests: EvidenceTestArtifact[];
  latestTestRun: TestRunSummary;
  latestBuildRun: TestRunSummary;
  verificationStatus: {
    localChecks: string;
    ciChecks: string;
    azureDeployment: string;
  };
  limitations: string[];
  evidencePending: string[];
  reproduction: {
    dependencies: string[];
    steps: string[];
  };
};

const commonDependencies = [
  "Node.js (current project uses Next.js 16.x, React 19.x, TypeScript 6.x)",
  "npm install",
  "Local binaries under node_modules/.bin for lint/typecheck/test/build",
];

const implementedWorkflowSteps = [
  "npm install",
  "node_modules/.bin/tsc.cmd -p tsconfig.test.json",
  "node --test .test-dist/tests/**/*.test.js",
  "node_modules/.bin/next.cmd build",
];

const referenceWorkflowSteps = [
  "npm install",
  "Review architecture model in lib/architecture-explorer-data.ts",
  "Open the project case-study route and inspect Architecture Explorer",
  "Implementation evidence requires source modules and automated tests specific to this case study",
];

const landingZoneWorkflowSteps = [
  "cd infrastructure/landing-zone",
  "terraform fmt -check -recursive",
  "terraform init -backend=false",
  "terraform validate",
  "terraform plan -refresh=false -var-file=terraform.tfvars.example -out=tfplan",
  "Open /projects/azure-landing-zone-iac-modules and /diagrams/landing-zone-sanitized.svg",
];

const testRunImplemented: TestRunSummary = {
  command: "node_modules/.bin/tsc.cmd -p tsconfig.test.json && node --test .test-dist/tests/**/*.test.js",
  date: "2026-09-26",
  result: "passed",
  totalTests: 21,
  passedTests: 21,
  failedTests: 0,
  details:
    "Automated tests passed for pipeline simulator logic, AIOps incident lab logic, architecture explorer coverage, project evidence integrity checks, and Landing Zone IaC artifact checks.",
};

const buildRunImplemented: TestRunSummary = {
  command: "node_modules/.bin/next.cmd build",
  date: "2026-09-26",
  result: "passed",
  details:
    "Production build completed successfully with prerendered case-study routes and both interactive demo routes.",
};

const testRunPending: TestRunSummary = {
  command: "No case-study-specific automated tests are currently implemented for this architecture draft.",
  date: "2026-09-26",
  result: "pending",
  details: "Evidence pending: add executable modules and targeted tests for this case study.",
};

const landingZoneLocalRun: TestRunSummary = {
  command:
    "node_modules/.bin/tsc.cmd -p tsconfig.test.json && node --test .test-dist/tests/**/*.test.js (includes landing-zone-iac tests)",
  date: "2026-09-26",
  result: "passed",
  totalTests: 21,
  passedTests: 21,
  failedTests: 0,
  details:
    "Repository tests pass, including landing-zone file/module/validation-command checks. Terraform/OpenTofu CLI checks are not performed in this environment because the CLIs are unavailable.",
};

const buildRunPending: TestRunSummary = {
  command: "node_modules/.bin/next.cmd build",
  date: "2026-09-26",
  result: "passed",
  details: "Portfolio build passes, but this case study still lacks project-specific implementation artifacts.",
};

const evidenceMap: Record<ProjectItem["slug"], ProjectEvidence> = {
  "azure-landing-zone-iac-modules": {
    slug: "azure-landing-zone-iac-modules",
    classification: "implemented_demo",
    implementedFiles: [
      { path: "infrastructure/landing-zone/main.tf", module: "Landing zone root module composition", status: "implemented" },
      { path: "infrastructure/landing-zone/variables.tf", module: "Input variables with validation constraints", status: "implemented" },
      { path: "infrastructure/landing-zone/terraform.tfvars.example", module: "Sanitized example input values", status: "implemented" },
      { path: "infrastructure/landing-zone/modules/resource-group/main.tf", module: "Reusable resource-group module", status: "implemented" },
      { path: "infrastructure/landing-zone/modules/networking/main.tf", module: "Reusable networking + NSG module", status: "implemented" },
      { path: "infrastructure/landing-zone/modules/key-vault/main.tf", module: "Reusable Key Vault security module", status: "implemented" },
      { path: "infrastructure/landing-zone/README.md", module: "Reproducible IaC instructions and limitations", status: "implemented" },
      { path: ".github/workflows/landing-zone-iac-checks.yml", module: "Credential-free CI checks (fmt/validate/plan/security)", status: "implemented" },
      { path: "public/diagrams/landing-zone-sanitized.svg", module: "Sanitized static architecture diagram", status: "implemented" },
      { path: "tests/landing-zone-iac.test.ts", module: "Automated IaC configuration tests", status: "implemented" },
    ],
    demoRoutes: [],
    diagramId: "azure-landing-zone-iac-modules",
    diagramClassification: "proposed",
    sanitizedDataFlow:
      "Governance hierarchy applies policy and shared networking baselines, then workload subscriptions emit diagnostics to centralized observability.",
    automatedTests: [
      { path: "tests/landing-zone-iac.test.ts", scope: "IaC file presence, module composition, validation rules, and README command coverage" },
      { path: "tests/architecture-explorer.test.ts", scope: "Diagram data schema and sanitization checks" },
    ],
    latestTestRun: landingZoneLocalRun,
    latestBuildRun: buildRunImplemented,
    verificationStatus: {
      localChecks: "Local repository checks executed (lint, typecheck, node tests, Next.js build). Terraform/OpenTofu CLI checks not performed in this environment.",
      ciChecks: "CI workflow added for fmt/init/validate/plan/tfsec without Azure credentials.",
      azureDeployment: "Not performed / Evidence pending. No Azure subscription deployment executed.",
    },
    limitations: [
      "This is a sanitized local demonstration and does not execute terraform apply in this repository workflow.",
      "Azure deployment verification is explicitly not performed in this repository evidence set.",
    ],
    evidencePending: [
      "Run terraform/tofu fmt, init, validate, and plan locally where Terraform/OpenTofu CLI is installed, then capture outputs.",
      "Azure deployment verification: Not performed / Evidence pending.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: landingZoneWorkflowSteps,
    },
  },
  "multi-environment-cicd-angular-dotnet-sql": {
    slug: "multi-environment-cicd-angular-dotnet-sql",
    classification: "implemented_demo",
    implementedFiles: [
      { path: "lib/pipeline-simulator.ts", module: "Deterministic CI/CD workflow engine", status: "implemented" },
      { path: "components/pipeline-simulator-demo.tsx", module: "Interactive pipeline UI", status: "implemented" },
      { path: "app/demos/azure-devops-pipeline/page.tsx", module: "Demo route entry", status: "implemented" },
      { path: "tests/pipeline-simulator.test.ts", module: "Pipeline behavior tests", status: "implemented" },
    ],
    demoRoutes: [{ route: "/demos/azure-devops-pipeline", label: "Azure DevOps Release Pipeline Simulator" }],
    diagramId: "multi-environment-cicd-angular-dotnet-sql",
    diagramClassification: "implemented_verified",
    sanitizedDataFlow:
      "Source commit triggers pipeline orchestration, quality/security gates enforce promotion controls, and staged application/database rollout follows approval checkpoints.",
    automatedTests: [
      { path: "tests/pipeline-simulator.test.ts", scope: "Pipeline gating, failure handling, pause/resume, and rollback" },
      { path: "tests/architecture-explorer.test.ts", scope: "Architecture explorer rendering and diagram model coverage" },
    ],
    latestTestRun: testRunImplemented,
    latestBuildRun: buildRunImplemented,
    verificationStatus: {
      localChecks: "Local demo logic and unit tests executed in repository.",
      ciChecks: "Uses repository test/build checks; no external cloud credentials required.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "This evidence demonstrates a local deterministic simulator, not a live Azure DevOps pipeline execution.",
      "No production deployment logs, environment credentials, or external release integrations are included.",
    ],
    evidencePending: [
      "Manual verification needed for real CI/CD infrastructure execution outside this repository.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: implementedWorkflowSteps,
    },
  },
  "aks-platform-engineering": {
    slug: "aks-platform-engineering",
    classification: "reference_architecture",
    implementedFiles: [
      { path: "content/projects.ts", module: "Case-study content definition", status: "implemented" },
      { path: "lib/architecture-explorer-data.ts", module: "AKS platform reference diagram data", status: "implemented" },
      { path: "components/architecture-explorer.tsx", module: "Interactive diagram UI", status: "implemented" },
      { path: "platform/aks", module: "AKS platform module implementation", status: "pending" },
    ],
    demoRoutes: [],
    diagramId: "aks-platform-engineering",
    diagramClassification: "proposed",
    sanitizedDataFlow:
      "Ingress and shared platform controls route workloads to namespaces while centralized telemetry captures platform and workload signals.",
    automatedTests: [{ path: "tests/architecture-explorer.test.ts", scope: "Diagram validation and explorer rendering" }],
    latestTestRun: testRunPending,
    latestBuildRun: buildRunPending,
    verificationStatus: {
      localChecks: "Architecture/content checks only.",
      ciChecks: "Repository lint/type/build checks available.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "No AKS platform module code, policy definitions, or deployment manifests are committed for this case study.",
      "No cluster-level conformance, reliability, or security test artifacts are available.",
    ],
    evidencePending: [
      "Add AKS platform implementation artifacts (Helm, manifests, policy definitions) and associated tests.",
      "Add reproducible environment setup instructions for cluster simulation or local validation.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: referenceWorkflowSteps,
    },
  },
  "blob-malware-scanning-defender-storage": {
    slug: "blob-malware-scanning-defender-storage",
    classification: "reference_architecture",
    implementedFiles: [
      { path: "content/projects.ts", module: "Case-study content definition", status: "implemented" },
      { path: "lib/architecture-explorer-data.ts", module: "Malware scanning reference diagram data", status: "implemented" },
      { path: "components/architecture-explorer.tsx", module: "Interactive diagram UI", status: "implemented" },
      { path: "security/malware-scanning", module: "Event-driven scan workflow implementation", status: "pending" },
    ],
    demoRoutes: [],
    diagramId: "blob-malware-scanning-defender-storage",
    diagramClassification: "reference",
    sanitizedDataFlow:
      "Uploaded objects are staged, scanned, then routed to approved storage or quarantine with incident notification signals.",
    automatedTests: [{ path: "tests/architecture-explorer.test.ts", scope: "Diagram validation and explorer rendering" }],
    latestTestRun: testRunPending,
    latestBuildRun: buildRunPending,
    verificationStatus: {
      localChecks: "Architecture/content checks only.",
      ciChecks: "Repository lint/type/build checks available.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "No storage event handlers, scan orchestration code, or quarantine workflow modules are committed.",
      "No malware scanning engine integration evidence is available in this repository.",
    ],
    evidencePending: [
      "Add event processing code and scan-result routing logic with integration tests.",
      "Add sanitized run logs that demonstrate quarantine and approved-path handling.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: referenceWorkflowSteps,
    },
  },
  "azure-devops-workload-visibility-powerbi": {
    slug: "azure-devops-workload-visibility-powerbi",
    classification: "reference_architecture",
    implementedFiles: [
      { path: "content/projects.ts", module: "Case-study content definition", status: "implemented" },
      { path: "lib/architecture-explorer-data.ts", module: "Workload visibility reference diagram data", status: "implemented" },
      { path: "components/architecture-explorer.tsx", module: "Interactive diagram UI", status: "implemented" },
      { path: "analytics/workload-visibility", module: "Reporting data-model implementation", status: "pending" },
    ],
    demoRoutes: [],
    diagramId: "azure-devops-workload-visibility-powerbi",
    diagramClassification: "reference",
    sanitizedDataFlow:
      "Work-item and pipeline telemetry are normalized into an analytics model and rendered through role-scoped dashboard views.",
    automatedTests: [{ path: "tests/architecture-explorer.test.ts", scope: "Diagram validation and explorer rendering" }],
    latestTestRun: testRunPending,
    latestBuildRun: buildRunPending,
    verificationStatus: {
      localChecks: "Architecture/content checks only.",
      ciChecks: "Repository lint/type/build checks available.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "No ETL implementation, semantic model definitions, or dashboard source files are committed.",
      "No refresh scheduling or metric-validation test outputs are present.",
    ],
    evidencePending: [
      "Add data extraction/transformation modules and semantic-model definitions.",
      "Add automated tests validating metric calculations and dataset integrity.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: referenceWorkflowSteps,
    },
  },
  "azure-ai-rag-infrastructure": {
    slug: "azure-ai-rag-infrastructure",
    classification: "reference_architecture",
    implementedFiles: [
      { path: "content/projects.ts", module: "Case-study content definition", status: "implemented" },
      { path: "lib/architecture-explorer-data.ts", module: "RAG reference diagram data", status: "implemented" },
      { path: "components/architecture-explorer.tsx", module: "Interactive diagram UI", status: "implemented" },
      { path: "ai/rag-infrastructure", module: "RAG ingestion/indexing/retrieval implementation", status: "pending" },
    ],
    demoRoutes: [],
    diagramId: "azure-ai-rag-infrastructure",
    diagramClassification: "proposed",
    sanitizedDataFlow:
      "Document ingestion feeds vector indexing, retrieval assembles context, guardrails enforce policy checks, and model responses emit sanitized telemetry.",
    automatedTests: [{ path: "tests/architecture-explorer.test.ts", scope: "Diagram validation and explorer rendering" }],
    latestTestRun: testRunPending,
    latestBuildRun: buildRunPending,
    verificationStatus: {
      localChecks: "Architecture/content checks only.",
      ciChecks: "Repository lint/type/build checks available.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "No live RAG service code, index schema, or model-call modules are committed.",
      "No retrieval quality, guardrail, or latency benchmark test evidence is available.",
    ],
    evidencePending: [
      "Add executable ingestion, indexing, and retrieval modules with test dataset fixtures.",
      "Add automated evaluation and guardrail tests with reproducible outputs.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: referenceWorkflowSteps,
    },
  },
  "azure-aiops-incident-intelligence": {
    slug: "azure-aiops-incident-intelligence",
    classification: "implemented_demo",
    implementedFiles: [
      { path: "lib/aiops-incident-lab.ts", module: "Deterministic incident-correlation and lifecycle engine", status: "implemented" },
      { path: "components/aiops-incident-lab-demo.tsx", module: "Interactive incident intelligence UI", status: "implemented" },
      { path: "app/demos/aiops-incident-lab/page.tsx", module: "Demo route entry", status: "implemented" },
      { path: "tests/aiops-incident-lab.test.ts", module: "AIOps lab logic tests", status: "implemented" },
    ],
    demoRoutes: [{ route: "/demos/aiops-incident-lab", label: "AIOps Incident Intelligence Lab" }],
    diagramId: "azure-aiops-incident-intelligence",
    diagramClassification: "reference",
    sanitizedDataFlow:
      "Monitor and log signals correlate into incidents, advisory summaries enrich responder context, and workflow approvals gate remediation actions.",
    automatedTests: [
      { path: "tests/aiops-incident-lab.test.ts", scope: "Correlation rules, lifecycle transitions, and remediation approval gating" },
      { path: "tests/architecture-explorer.test.ts", scope: "Architecture explorer rendering and diagram model coverage" },
    ],
    latestTestRun: testRunImplemented,
    latestBuildRun: buildRunImplemented,
    verificationStatus: {
      localChecks: "Local demo logic and unit tests executed in repository.",
      ciChecks: "Uses repository test/build checks; no external cloud credentials required.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "Evidence is for a local deterministic simulation and advisory workflow, not live Azure telemetry ingestion.",
      "No production incident-management integration logs are included.",
    ],
    evidencePending: [
      "Manual verification needed for operational integrations (for example ticketing/workflow systems) outside this repository.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: implementedWorkflowSteps,
    },
  },
  "aks-aiops-platform-reliability": {
    slug: "aks-aiops-platform-reliability",
    classification: "implemented_demo",
    implementedFiles: [
      { path: "lib/aiops-incident-lab.ts", module: "Deterministic incident-correlation and lifecycle engine", status: "implemented" },
      { path: "components/aiops-incident-lab-demo.tsx", module: "Interactive incident intelligence UI", status: "implemented" },
      { path: "app/demos/aiops-incident-lab/page.tsx", module: "Demo route entry", status: "implemented" },
      { path: "tests/aiops-incident-lab.test.ts", module: "AIOps lab logic tests", status: "implemented" },
      { path: "lib/architecture-explorer-data.ts", module: "AKS AIOps reference architecture model", status: "implemented" },
    ],
    demoRoutes: [{ route: "/demos/aiops-incident-lab", label: "AIOps Incident Intelligence Lab" }],
    diagramId: "aks-aiops-platform-reliability",
    diagramClassification: "proposed",
    sanitizedDataFlow:
      "AKS runtime signals aggregate into anomaly analysis and AIOps briefs, then approved runbook controls apply remediation decisions.",
    automatedTests: [
      { path: "tests/aiops-incident-lab.test.ts", scope: "Incident lifecycle and remediation controls used by the AIOps demo" },
      { path: "tests/architecture-explorer.test.ts", scope: "Diagram validation and explorer rendering" },
    ],
    latestTestRun: testRunImplemented,
    latestBuildRun: buildRunImplemented,
    verificationStatus: {
      localChecks: "Local demo logic and unit tests executed in repository.",
      ciChecks: "Uses repository test/build checks; no external cloud credentials required.",
      azureDeployment: "Not performed / Evidence pending.",
    },
    limitations: [
      "AKS-specific anomaly and runbook execution is represented by shared simulation logic, not a live cluster integration.",
      "No production SLO or reliability metric evidence is included.",
    ],
    evidencePending: [
      "Manual verification needed for real AKS telemetry and runbook integrations outside this repository.",
    ],
    reproduction: {
      dependencies: commonDependencies,
      steps: implementedWorkflowSteps,
    },
  },
};

export function getProjectEvidence(slug: ProjectItem["slug"]): ProjectEvidence | undefined {
  return evidenceMap[slug];
}

export function getEvidenceClassificationLabel(classification: EvidenceClassification): string {
  switch (classification) {
    case "implemented_demo":
      return "Implemented demo evidence";
    case "production_verified":
      return "Production-verified implementation";
    case "reference_architecture":
      return "Reference architecture evidence";
    default:
      return "Reference architecture evidence";
  }
}

export function getArchitectureClassificationLabel(slug: ProjectItem["slug"]): string {
  const evidence = evidenceMap[slug];
  if (!evidence) {
    return "Unknown";
  }

  const diagram = getArchitectureDiagram(evidence.diagramId);
  return diagram ? getClassificationLabel(diagram.classification) : "Unknown";
}

export function listEvidenceCoverage() {
  return (Object.values(evidenceMap) as ProjectEvidence[]).map((entry) => ({
    slug: entry.slug,
    classification: entry.classification,
    hasPending: entry.evidencePending.length > 0,
    pendingCount: entry.evidencePending.length,
  }));
}
