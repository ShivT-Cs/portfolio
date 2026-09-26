"use client";

import { useMemo, useReducer, useState } from "react";
import {
  aiopsLabInitialState,
  aiopsLabReducer,
  createIncidentPayload,
  remediationPlan,
  SCENARIO_LABELS,
  ScenarioKey,
  TimeWindowKey,
} from "@/lib/aiops-incident-lab";
import { ArchitectureExplorer } from "@/components/architecture-explorer";

const windows: TimeWindowKey[] = ["15m", "30m", "60m"];
const scenarios: ScenarioKey[] = ["aks_high_latency", "pod_crash_loop", "deployment_failure", "storage_throttling"];

function statusTone(status: string): string {
  switch (status) {
    case "new":
      return "border-white/20 bg-white/5 text-ink";
    case "acknowledged":
      return "border-accent/45 bg-accent/15 text-ink";
    case "assigned":
      return "border-sky-400/45 bg-sky-500/12 text-sky-100";
    case "investigating":
      return "border-violet-400/45 bg-violet-500/12 text-violet-100";
    case "resolved":
      return "border-emerald-400/45 bg-emerald-500/12 text-emerald-100";
    case "closed":
      return "border-cyan-300/45 bg-cyan-500/12 text-cyan-100";
    default:
      return "border-white/20 bg-white/5 text-ink";
  }
}

export function AIOpsIncidentLabDemo() {
  const [state, dispatch] = useReducer(aiopsLabReducer, aiopsLabInitialState);
  const [assigneeDraft, setAssigneeDraft] = useState("Ops Engineer");

  const selectedCorrelation = state.correlatedAlerts.find((item) => item.ruleId === state.selectedCorrelationId) ?? null;
  const remediationSteps = remediationPlan(state.scenario);
  const incidentPayload = useMemo(() => createIncidentPayload(state), [state]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Interactive AIOps Demo</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">AIOps Incident Intelligence Lab</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Synthetic telemetry and deterministic correlation rules only. No external API calls, no live Azure integration, and no real credentials.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink">Scenario and Time Window</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
          <label className="flex flex-col gap-2 text-sm text-muted">
            Incident Scenario
            <select
              value={state.scenario}
              onChange={(event) => dispatch({ type: "set_scenario", scenario: event.target.value as ScenarioKey })}
              className="min-h-[44px] rounded-lg border border-white/20 bg-surface px-3 text-ink"
              aria-label="Scenario selector"
            >
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {SCENARIO_LABELS[scenario]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted">
            Time Window
            <select
              value={state.window}
              onChange={(event) => dispatch({ type: "set_window", window: event.target.value as TimeWindowKey })}
              className="min-h-[44px] rounded-lg border border-white/20 bg-surface px-3 text-ink"
              aria-label="Incident timeline window"
            >
              {windows.map((window) => (
                <option key={window} value={window}>
                  {window}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => dispatch({ type: "generate_incident" })}
            className="min-h-[44px] rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accentSoft"
          >
            Generate Incident
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="min-h-[44px] rounded-lg border border-white/20 px-4 text-sm font-semibold text-ink transition hover:border-accent"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Synthetic Telemetry</h2>
          <p className="mt-2 text-xs text-muted">
            Synthetic logs, metrics, and alerts are generated locally from scenario templates and deterministic filters.
          </p>

          <div className="mt-4 max-h-[320px] overflow-y-auto rounded-lg border border-white/12 bg-surface/60 p-3">
            <ul className="space-y-2 text-xs leading-relaxed text-muted">
              {state.telemetry.map((event) => (
                <li key={event.id} className="rounded-md border border-white/10 bg-surface/50 p-2">
                  <p className="text-ink">[{event.type.toUpperCase()}] {event.signal}</p>
                  <p>{event.source} | t-{event.minuteOffset}m | {event.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-accentSoft">Incident Timeline</h3>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            {state.timeline.map((note, index) => (
              <li key={`${note}-${index}`} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
                {note}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Incident Lifecycle</h2>
          <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${statusTone(state.incidentStatus)}`}>
            {state.incidentStatus}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button type="button" onClick={() => dispatch({ type: "acknowledge" })} className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent">
              Acknowledge
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "assign", assignee: assigneeDraft })}
              className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent"
            >
              Assign
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "start_investigation" })}
              className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent"
            >
              Investigate
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "resolve" })}
              className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent"
            >
              Resolve
            </button>
            <button type="button" onClick={() => dispatch({ type: "close" })} className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent">
              Close
            </button>
          </div>

          <label className="mt-4 block text-sm text-muted">
            Assignment (simulated)
            <input
              value={assigneeDraft}
              onChange={(event) => setAssigneeDraft(event.target.value)}
              className="mt-2 min-h-[42px] w-full rounded-md border border-white/20 bg-surface px-3 text-ink"
            />
          </label>

          <p className="mt-3 text-xs text-muted">Current assignee: {state.assignee || "Unassigned"}</p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Alert Correlation and Probable Cause</h2>
          <p className="mt-2 text-xs text-muted">
            Correlation is driven by explicit deterministic rules. Any AI-style narrative below is mock explanatory text.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {state.correlatedAlerts.map((item) => (
              <button
                key={item.ruleId}
                type="button"
                onClick={() => dispatch({ type: "select_correlation", id: item.ruleId })}
                className={`rounded-md border px-3 py-2 text-xs ${
                  state.selectedCorrelationId === item.ruleId
                    ? "border-accent bg-accent/20 text-ink"
                    : "border-white/20 bg-surface/50 text-muted hover:border-accent/50"
                }`}
              >
                {item.ruleId}
              </button>
            ))}
          </div>

          {selectedCorrelation ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="text-ink">{selectedCorrelation.title}</p>
              <p>{selectedCorrelation.summary}</p>
              <p><span className="text-ink">Evidence:</span> {selectedCorrelation.matchedEventIds.join(", ")}</p>
              <p><span className="text-ink">Contributing signals:</span> {selectedCorrelation.contributingSignals.join(", ")}</p>
              <p><span className="text-ink">Confidence limitations:</span> {selectedCorrelation.confidenceBoundaries.join(" | ")}</p>
              <p><span className="text-ink">Alternative hypotheses:</span> {selectedCorrelation.alternativeHypotheses.join(" | ")}</p>
              <p><span className="text-ink">Heuristic score note:</span> {selectedCorrelation.confidenceNote}</p>
              <p className="rounded-md border border-white/10 bg-surface/50 p-3 text-xs">
                {selectedCorrelation.mockAiNarrative} (Marked as mock AI-generated text.)
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No rule correlation available for this scenario and window.</p>
          )}
        </article>

        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Suggested Remediation and Approval</h2>
          <p className="mt-2 text-xs text-muted">Simulated runbook actions require explicit human approval before execution.</p>

          <ol className="mt-4 space-y-2 text-sm text-muted">
            {remediationSteps.map((step) => (
              <li key={step.id} className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">
                {step.step}
                {step.approvalRequired ? <span className="ml-2 text-accentSoft">(Approval required)</span> : null}
              </li>
            ))}
          </ol>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "approve_remediation" })}
              className="min-h-[42px] rounded-md border border-accent/45 bg-accent/20 px-3 text-sm font-semibold text-ink"
            >
              Approve Remediation
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "execute_remediation" })}
              className="min-h-[42px] rounded-md border border-white/20 px-3 text-sm text-ink hover:border-accent"
            >
              Execute Simulated Action
            </button>
          </div>

          <p className="mt-3 text-xs text-muted">
            Approval status: {state.remediationApproved ? "Approved" : "Pending"} | Execution status: {state.remediationExecuted ? "Executed" : "Not executed"}
          </p>
        </article>
      </section>

      <ArchitectureExplorer diagramId="demo-aiops-incident-lab" className="mt-6" />

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Technical Details</h2>
          <p className="mt-2 text-sm text-muted">Correlation logic is deterministic and testable. No trained predictive model is used.</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">Rule examples: latency + cpu + dependency slow-call, crashloop + restarts + exit codes.</li>
            <li className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">Incident states: new -&gt; acknowledged -&gt; assigned -&gt; investigating -&gt; resolved -&gt; closed.</li>
            <li className="rounded-md border border-white/10 bg-surface/50 px-3 py-2">Simulated remediation requires explicit approval before execution.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Sanitized Incident Payload</h2>
          <pre className="mt-3 overflow-x-auto rounded-md border border-white/12 bg-surface/70 p-3 text-xs text-muted">
{JSON.stringify(incidentPayload, null, 2)}
          </pre>
        </article>
      </section>
    </main>
  );
}
