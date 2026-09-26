"use client";

import { useEffect, useMemo, useReducer } from "react";
import {
  FailureScenario,
  pipelineInitialState,
  pipelineReducer,
  STAGE_LABELS,
  STAGE_ORDER,
  StageKey,
  getStageDuration,
  DeploymentTarget,
} from "@/lib/pipeline-simulator";
import { ArchitectureExplorer } from "@/components/architecture-explorer";

const stageDescriptions: Record<StageKey, string> = {
  source: "Pulls source code and pipeline templates from the configured Git repository.",
  build: "Compiles and packages application artifacts for downstream deployment stages.",
  testQuality: "Runs test suites and quality checks before any environment deployment.",
  securityScan: "Evaluates dependency/security policy checks as a release gate.",
  devDeployment: "Deploys artifacts to the Dev environment with health verification.",
  uatApproval: "Represents controlled promotion to UAT after validation criteria are met.",
  productionApproval: "Requires explicit manual approval before production rollout.",
  rollback: "Triggers a controlled rollback path when deployment risk is detected.",
};

function statusTone(status: string): string {
  switch (status) {
    case "success":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
    case "failed":
      return "border-rose-400/40 bg-rose-500/10 text-rose-200";
    case "blocked":
      return "border-amber-400/40 bg-amber-500/10 text-amber-100";
    case "running":
      return "border-accent/60 bg-accent/15 text-ink";
    case "waiting_approval":
      return "border-violet-400/45 bg-violet-500/12 text-violet-100";
    case "rolled_back":
      return "border-cyan-300/45 bg-cyan-500/12 text-cyan-100";
    case "skipped":
      return "border-white/15 bg-white/5 text-muted";
    default:
      return "border-white/15 bg-white/5 text-muted";
  }
}

export function PipelineSimulatorDemo() {
  const [state, dispatch] = useReducer(pipelineReducer, pipelineInitialState);

  useEffect(() => {
    if (!state.isRunning || state.isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      dispatch({ type: "tick" });
    }, 180);

    return () => window.clearInterval(timer);
  }, [state.isRunning, state.isPaused]);

  const stageSummaries = useMemo(() => {
    return STAGE_ORDER.map((stage) => {
      const stageState = state.stages[stage];
      const durationTicks = getStageDuration(state, stage);
      return {
        stage,
        label: STAGE_LABELS[stage],
        status: stageState.status,
        simulatedDuration: `${(durationTicks * 0.18).toFixed(2)}s`,
      };
    });
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Interactive Demo</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">Azure DevOps Release Pipeline Simulator</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Deterministic local simulation for portfolio demonstration. This demo does not call Azure APIs and does not execute real deployments.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink">Pipeline Controls</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-end">
          <label className="flex flex-col gap-2 text-sm text-muted">
            Deployment Target
            <select
              value={state.target}
              onChange={(event) => dispatch({ type: "set_target", target: event.target.value as DeploymentTarget })}
              className="min-h-[44px] rounded-lg border border-white/20 bg-surface px-3 text-ink"
              aria-label="Deployment target selector"
            >
              <option value="dev">Dev</option>
              <option value="uat">UAT</option>
              <option value="production">Production</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-muted">
            Failure Scenario
            <select
              value={state.failureScenario}
              onChange={(event) => dispatch({ type: "set_failure_scenario", scenario: event.target.value as FailureScenario })}
              className="min-h-[44px] rounded-lg border border-white/20 bg-surface px-3 text-ink"
              aria-label="Failure scenario selector"
            >
              <option value="none">No Failure</option>
              <option value="test_failure">Test Failure</option>
              <option value="security_failure">Security Gate Failure</option>
              <option value="deployment_failure">Deployment Failure</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => dispatch({ type: "run" })}
            className="min-h-[44px] rounded-lg bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accentSoft"
          >
            Run Pipeline
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "pause_resume" })}
            className="min-h-[44px] rounded-lg border border-white/20 px-4 text-sm font-semibold text-ink transition hover:border-accent"
            disabled={!state.isRunning}
          >
            {state.isPaused ? "Resume" : "Pause"}
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="min-h-[44px] rounded-lg border border-white/20 px-4 text-sm font-semibold text-ink transition hover:border-accent"
          >
            Reset
          </button>
        </div>

        {state.awaitingProductionApproval ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-violet-300/30 bg-violet-500/10 p-3">
            <p className="text-sm text-violet-100">Production approval is required before rollout can continue.</p>
            <button
              type="button"
              onClick={() => dispatch({ type: "approve_production" })}
              className="min-h-[40px] rounded-md bg-violet-500/80 px-3 text-sm font-semibold text-white"
            >
              Approve Production
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink">Pipeline Stages</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stageSummaries.map((item) => (
            <button
              key={item.stage}
              type="button"
              onClick={() => dispatch({ type: "select_stage", stage: item.stage })}
              className={`rounded-xl border p-3 text-left transition ${statusTone(item.status)} ${state.selectedStage === item.stage ? "ring-2 ring-accent" : ""}`}
              aria-pressed={state.selectedStage === item.stage}
            >
              <p className="text-xs uppercase tracking-[0.16em]">{item.label}</p>
              <p className="mt-2 text-sm font-semibold capitalize">{item.status.replace("_", " ")}</p>
              <p className="mt-1 text-xs">Simulated duration: {item.simulatedDuration}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Stage Details</h2>
          <p className="mt-3 text-sm text-muted">{stageDescriptions[state.selectedStage]}</p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p>
              <span className="text-ink">Status:</span> {state.stages[state.selectedStage].status.replace("_", " ")}
            </p>
            <p>
              <span className="text-ink">Simulated duration:</span> {(getStageDuration(state, state.selectedStage) * 0.18).toFixed(2)}s
            </p>
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-accentSoft">Environment Status</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
            <div className="rounded-md border border-white/15 bg-surface/60 p-2">Dev: {state.env.dev.replace("_", " ")}</div>
            <div className="rounded-md border border-white/15 bg-surface/60 p-2">UAT: {state.env.uat.replace("_", " ")}</div>
            <div className="rounded-md border border-white/15 bg-surface/60 p-2">Prod: {state.env.production.replace("_", " ")}</div>
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-accentSoft">Artifacts</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {state.artifacts.length === 0 ? <li>No artifacts generated yet.</li> : null}
            {state.artifacts.map((artifact) => (
              <li key={artifact} className="rounded-md border border-white/15 bg-surface/50 px-3 py-2">
                {artifact}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-ink">Pipeline Logs</h2>
          <div className="mt-3 max-h-[340px] overflow-y-auto rounded-lg border border-white/12 bg-surface/60 p-3">
            <ul className="space-y-2 text-xs leading-relaxed text-muted">
              {state.logs.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <ArchitectureExplorer diagramId="demo-azure-devops-pipeline" className="mt-6" />
    </main>
  );
}
