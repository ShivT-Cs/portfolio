export type ScenarioKey = "aks_high_latency" | "pod_crash_loop" | "deployment_failure" | "storage_throttling";
export type TimeWindowKey = "15m" | "30m" | "60m";
export type IncidentStatus = "new" | "acknowledged" | "assigned" | "investigating" | "resolved" | "closed";

export type TelemetryType = "log" | "metric" | "alert";

export type TelemetryEvent = {
  id: string;
  minuteOffset: number;
  source: string;
  type: TelemetryType;
  signal: string;
  value: string;
  severity: "low" | "medium" | "high";
};

export type CorrelationResult = {
  title: string;
  ruleId: string;
  summary: string;
  matchedEventIds: string[];
  contributingSignals: string[];
  confidenceNote: string;
  confidenceBoundaries: string[];
  alternativeHypotheses: string[];
  mockAiNarrative: string;
};

export type RemediationStep = {
  id: string;
  step: string;
  approvalRequired: boolean;
};

export type LabState = {
  scenario: ScenarioKey;
  window: TimeWindowKey;
  incidentStatus: IncidentStatus;
  assignee: string;
  isAcknowledged: boolean;
  remediationApproved: boolean;
  remediationExecuted: boolean;
  timeline: string[];
  telemetry: TelemetryEvent[];
  correlatedAlerts: CorrelationResult[];
  selectedCorrelationId: string | null;
};

export type LabAction =
  | { type: "set_scenario"; scenario: ScenarioKey }
  | { type: "set_window"; window: TimeWindowKey }
  | { type: "generate_incident" }
  | { type: "acknowledge" }
  | { type: "assign"; assignee: string }
  | { type: "start_investigation" }
  | { type: "approve_remediation" }
  | { type: "execute_remediation" }
  | { type: "resolve" }
  | { type: "close" }
  | { type: "select_correlation"; id: string }
  | { type: "reset" };

const WINDOW_TO_MINUTES: Record<TimeWindowKey, number> = {
  "15m": 15,
  "30m": 30,
  "60m": 60,
};

export const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  aks_high_latency: "AKS high latency",
  pod_crash_loop: "Pod crash loop",
  deployment_failure: "Deployment failure",
  storage_throttling: "Storage throttling",
};

const remediationByScenario: Record<ScenarioKey, RemediationStep[]> = {
  aks_high_latency: [
    { id: "r1", step: "Confirm latency hotspot via Application Insights dependency traces.", approvalRequired: false },
    { id: "r2", step: "Scale impacted AKS workload and verify HPA thresholds.", approvalRequired: true },
    { id: "r3", step: "Review Azure Front Door / gateway routing before closing incident.", approvalRequired: false },
  ],
  pod_crash_loop: [
    { id: "r1", step: "Inspect pod restart events and container exit reasons in Container Insights.", approvalRequired: false },
    { id: "r2", step: "Roll back failing image tag to last known stable release.", approvalRequired: true },
    { id: "r3", step: "Re-run readiness/liveness verification after rollback.", approvalRequired: false },
  ],
  deployment_failure: [
    { id: "r1", step: "Validate deployment job logs and failed health probe evidence.", approvalRequired: false },
    { id: "r2", step: "Trigger controlled rollback in release workflow.", approvalRequired: true },
    { id: "r3", step: "Re-open release gate after test and security checks pass.", approvalRequired: false },
  ],
  storage_throttling: [
    { id: "r1", step: "Check throttling metrics and request burst profile in Log Analytics.", approvalRequired: false },
    { id: "r2", step: "Apply staged retry policy and queue backpressure controls.", approvalRequired: true },
    { id: "r3", step: "Validate throughput stabilization before restoring normal traffic.", approvalRequired: false },
  ],
};

function syntheticTelemetry(scenario: ScenarioKey): TelemetryEvent[] {
  switch (scenario) {
    case "aks_high_latency":
      return [
        { id: "e1", minuteOffset: 55, source: "Azure Monitor", type: "metric", signal: "P95 Latency", value: "1200ms", severity: "high" },
        { id: "e2", minuteOffset: 52, source: "Application Insights", type: "log", signal: "Dependency Slow Call", value: "payments-api", severity: "high" },
        { id: "e3", minuteOffset: 49, source: "Log Analytics", type: "alert", signal: "Node CPU saturation", value: "91%", severity: "medium" },
        { id: "e4", minuteOffset: 42, source: "Azure Monitor", type: "metric", signal: "Request Error Rate", value: "2.8%", severity: "medium" },
      ];
    case "pod_crash_loop":
      return [
        { id: "e1", minuteOffset: 58, source: "Container Insights", type: "alert", signal: "CrashLoopBackOff", value: "checkout-service", severity: "high" },
        { id: "e2", minuteOffset: 56, source: "Log Analytics", type: "log", signal: "Container Exit Code", value: "137", severity: "high" },
        { id: "e3", minuteOffset: 50, source: "Azure Monitor", type: "metric", signal: "Pod Restart Count", value: "14", severity: "high" },
        { id: "e4", minuteOffset: 38, source: "Application Insights", type: "metric", signal: "Request Failure", value: "5.1%", severity: "medium" },
      ];
    case "deployment_failure":
      return [
        { id: "e1", minuteOffset: 59, source: "Azure DevOps", type: "alert", signal: "Release Stage Failed", value: "UAT", severity: "high" },
        { id: "e2", minuteOffset: 57, source: "Application Insights", type: "log", signal: "Startup Exception", value: "Config key missing", severity: "high" },
        { id: "e3", minuteOffset: 53, source: "Azure Monitor", type: "metric", signal: "Health Probe Failures", value: "7", severity: "high" },
        { id: "e4", minuteOffset: 45, source: "Log Analytics", type: "log", signal: "Rollback Trigger Condition", value: "met", severity: "medium" },
      ];
    case "storage_throttling":
      return [
        { id: "e1", minuteOffset: 57, source: "Azure Monitor", type: "metric", signal: "Storage Throttled Requests", value: "240", severity: "high" },
        { id: "e2", minuteOffset: 54, source: "Log Analytics", type: "log", signal: "Retry Burst", value: "queue-worker", severity: "medium" },
        { id: "e3", minuteOffset: 52, source: "Application Insights", type: "alert", signal: "Dependency Timeout", value: "blob-write", severity: "high" },
        { id: "e4", minuteOffset: 40, source: "Azure Monitor", type: "metric", signal: "Queue Lag", value: "11m", severity: "medium" },
      ];
    default:
      return [];
  }
}

export function telemetryForWindow(scenario: ScenarioKey, window: TimeWindowKey): TelemetryEvent[] {
  const events = syntheticTelemetry(scenario);
  const minutes = WINDOW_TO_MINUTES[window];
  return events.filter((event) => event.minuteOffset <= minutes + 45);
}

export function correlateAlerts(events: TelemetryEvent[], scenario: ScenarioKey): CorrelationResult[] {
  const bySignal = new Set(events.map((event) => event.signal));

  const rules: Record<ScenarioKey, CorrelationResult> = {
    aks_high_latency: {
      title: "AKS latency cluster pressure correlation",
      ruleId: "RULE-AKS-LATENCY-01",
      summary: "High latency combined with node CPU saturation and dependency slow calls indicates capacity and downstream contention.",
      matchedEventIds: events.filter((event) => ["P95 Latency", "Node CPU saturation", "Dependency Slow Call"].includes(event.signal)).map((e) => e.id),
      contributingSignals: ["P95 Latency", "Node CPU saturation", "Dependency Slow Call"],
      confidenceNote: "Heuristic confidence score: 4/5 (rule-based, non-calibrated).",
      confidenceBoundaries: [
        "No predictive model is used; this score reflects deterministic rule match strength.",
        "Missing network trace depth can hide external dependency causes.",
      ],
      alternativeHypotheses: ["Ingress misconfiguration", "Regional dependency degradation"],
      mockAiNarrative:
        "Mock AI-style narrative: Correlated telemetry suggests latency amplification due to compute pressure and slow downstream dependencies.",
    },
    pod_crash_loop: {
      title: "Crash-loop restart amplification",
      ruleId: "RULE-POD-RESTART-02",
      summary: "CrashLoopBackOff + elevated restart count + fatal container exit code indicates unstable rollout or runtime misconfiguration.",
      matchedEventIds: events.filter((event) => ["CrashLoopBackOff", "Pod Restart Count", "Container Exit Code"].includes(event.signal)).map((e) => e.id),
      contributingSignals: ["CrashLoopBackOff", "Pod Restart Count", "Container Exit Code"],
      confidenceNote: "Heuristic confidence score: 4/5 (rule-based, non-calibrated).",
      confidenceBoundaries: [
        "Root cause may still require container-level diagnostics.",
        "Exit code patterns can overlap memory pressure and config defects.",
      ],
      alternativeHypotheses: ["Dependency startup ordering issue", "OOM condition under burst load"],
      mockAiNarrative:
        "Mock AI-style narrative: Event grouping indicates repeated container restarts after rollout and likely startup/config instability.",
    },
    deployment_failure: {
      title: "Release gate and startup failure convergence",
      ruleId: "RULE-DEPLOY-FAIL-03",
      summary: "Release stage failure with startup exception and probe instability indicates failed deployment viability.",
      matchedEventIds: events.filter((event) => ["Release Stage Failed", "Startup Exception", "Health Probe Failures"].includes(event.signal)).map((e) => e.id),
      contributingSignals: ["Release Stage Failed", "Startup Exception", "Health Probe Failures"],
      confidenceNote: "Heuristic confidence score: 5/5 (rule-based, non-calibrated).",
      confidenceBoundaries: [
        "Does not infer future release quality.",
        "Requires manual review of deployment logs and config baselines.",
      ],
      alternativeHypotheses: ["Secret/version mismatch", "Transient dependency outage during warm-up"],
      mockAiNarrative:
        "Mock AI-style narrative: Deployment appears to have failed acceptance due to startup and health-check convergence.",
    },
    storage_throttling: {
      title: "Storage saturation and timeout chain",
      ruleId: "RULE-STORAGE-THROTTLE-04",
      summary: "Throttled storage requests with dependency timeouts and queue lag indicate throughput bottleneck and retry amplification.",
      matchedEventIds: events.filter((event) => ["Storage Throttled Requests", "Dependency Timeout", "Queue Lag"].includes(event.signal)).map((e) => e.id),
      contributingSignals: ["Storage Throttled Requests", "Dependency Timeout", "Queue Lag"],
      confidenceNote: "Heuristic confidence score: 4/5 (rule-based, non-calibrated).",
      confidenceBoundaries: [
        "Signal set does not include full upstream traffic profile.",
        "Throttling may be secondary to burst scheduling behavior.",
      ],
      alternativeHypotheses: ["Inefficient batch write pattern", "Queue consumer concurrency misconfiguration"],
      mockAiNarrative:
        "Mock AI-style narrative: Telemetry points to storage contention driving retries and service timeout propagation.",
    },
  };

  const base = rules[scenario];
  if (!base.contributingSignals.every((signal) => bySignal.has(signal))) {
    return [];
  }

  return [base];
}

export function createIncidentPayload(state: LabState) {
  return {
    incidentId: `INC-${SCENARIO_LABELS[state.scenario].replace(/\s+/g, "-").toUpperCase()}`,
    scenario: state.scenario,
    status: state.incidentStatus,
    syntheticTelemetry: true,
    deterministicCorrelationRules: true,
    selectedWindow: state.window,
    correlatedRules: state.correlatedAlerts.map((item) => item.ruleId),
    remediationApproved: state.remediationApproved,
    remediationExecuted: state.remediationExecuted,
  };
}

function stateForScenario(scenario: ScenarioKey, window: TimeWindowKey): LabState {
  const telemetry = telemetryForWindow(scenario, window);
  const correlated = correlateAlerts(telemetry, scenario);
  return {
    scenario,
    window,
    incidentStatus: "new",
    assignee: "",
    isAcknowledged: false,
    remediationApproved: false,
    remediationExecuted: false,
    timeline: ["Synthetic incident initialized for selected scenario."],
    telemetry,
    correlatedAlerts: correlated,
    selectedCorrelationId: correlated[0]?.ruleId ?? null,
  };
}

export const aiopsLabInitialState: LabState = stateForScenario("aks_high_latency", "30m");

function addTimeline(state: LabState, note: string): LabState {
  return { ...state, timeline: [...state.timeline, note] };
}

export function aiopsLabReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case "set_scenario":
      return stateForScenario(action.scenario, state.window);
    case "set_window":
      return stateForScenario(state.scenario, action.window);
    case "generate_incident": {
      const refreshed = stateForScenario(state.scenario, state.window);
      return addTimeline(refreshed, "Incident correlation generated from deterministic rule set.");
    }
    case "acknowledge":
      if (state.incidentStatus !== "new") {
        return state;
      }
      return addTimeline({ ...state, incidentStatus: "acknowledged", isAcknowledged: true }, "Incident acknowledged by responder.");
    case "assign":
      if (!state.isAcknowledged || !action.assignee.trim()) {
        return state;
      }
      return addTimeline(
        { ...state, incidentStatus: "assigned", assignee: action.assignee.trim() },
        `Incident assigned to ${action.assignee.trim()}.`
      );
    case "start_investigation":
      if (state.incidentStatus !== "assigned") {
        return state;
      }
      return addTimeline({ ...state, incidentStatus: "investigating" }, "Investigation started with evidence review.");
    case "approve_remediation":
      if (state.incidentStatus !== "investigating") {
        return state;
      }
      return addTimeline({ ...state, remediationApproved: true }, "Human approval granted for simulated remediation.");
    case "execute_remediation":
      if (!state.remediationApproved || state.incidentStatus !== "investigating") {
        return state;
      }
      return addTimeline(
        { ...state, remediationExecuted: true },
        "Simulated remediation action executed in controlled mode (no external API calls)."
      );
    case "resolve":
      if (!state.remediationExecuted || state.incidentStatus !== "investigating") {
        return state;
      }
      return addTimeline({ ...state, incidentStatus: "resolved" }, "Incident marked resolved after validation checks.");
    case "close":
      if (state.incidentStatus !== "resolved") {
        return state;
      }
      return addTimeline({ ...state, incidentStatus: "closed" }, "Incident closed with documented findings.");
    case "select_correlation":
      return { ...state, selectedCorrelationId: action.id };
    case "reset":
      return stateForScenario(state.scenario, state.window);
    default:
      return state;
  }
}

export function remediationPlan(scenario: ScenarioKey): RemediationStep[] {
  return remediationByScenario[scenario];
}
