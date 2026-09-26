export type DeploymentTarget = "dev" | "uat" | "production";
export type FailureScenario = "none" | "test_failure" | "security_failure" | "deployment_failure";

export type StageKey =
  | "source"
  | "build"
  | "testQuality"
  | "securityScan"
  | "devDeployment"
  | "uatApproval"
  | "productionApproval"
  | "rollback";

export type StageStatus =
  | "idle"
  | "running"
  | "success"
  | "failed"
  | "blocked"
  | "waiting_approval"
  | "rolled_back"
  | "skipped";

export type EnvironmentStatus = "not_deployed" | "deployed" | "pending_approval" | "rolled_back" | "blocked";

export type StageState = {
  status: StageStatus;
  startedTick: number | null;
  endedTick: number | null;
};

export type PipelineState = {
  tick: number;
  runId: number;
  isRunning: boolean;
  isPaused: boolean;
  awaitingProductionApproval: boolean;
  target: DeploymentTarget;
  failureScenario: FailureScenario;
  stages: Record<StageKey, StageState>;
  logs: string[];
  artifacts: string[];
  env: {
    dev: EnvironmentStatus;
    uat: EnvironmentStatus;
    production: EnvironmentStatus;
  };
  selectedStage: StageKey;
};

export type PipelineAction =
  | { type: "set_target"; target: DeploymentTarget }
  | { type: "set_failure_scenario"; scenario: FailureScenario }
  | { type: "run" }
  | { type: "tick" }
  | { type: "pause_resume" }
  | { type: "approve_production" }
  | { type: "select_stage"; stage: StageKey }
  | { type: "reset" };

export const STAGE_ORDER: StageKey[] = [
  "source",
  "build",
  "testQuality",
  "securityScan",
  "devDeployment",
  "uatApproval",
  "productionApproval",
  "rollback",
];

const DURATIONS: Record<StageKey, number> = {
  source: 1,
  build: 2,
  testQuality: 2,
  securityScan: 2,
  devDeployment: 2,
  uatApproval: 1,
  productionApproval: 1,
  rollback: 2,
};

export const STAGE_LABELS: Record<StageKey, string> = {
  source: "Source",
  build: "Build",
  testQuality: "Test/Quality",
  securityScan: "Security Scan",
  devDeployment: "Dev Deployment",
  uatApproval: "UAT Approval",
  productionApproval: "Production Approval",
  rollback: "Rollback",
};

function createStageState(): Record<StageKey, StageState> {
  return STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = { status: "idle", startedTick: null, endedTick: null };
      return acc;
    },
    {} as Record<StageKey, StageState>
  );
}

function initialState(target: DeploymentTarget = "dev", scenario: FailureScenario = "none"): PipelineState {
  return {
    tick: 0,
    runId: 1,
    isRunning: false,
    isPaused: false,
    awaitingProductionApproval: false,
    target,
    failureScenario: scenario,
    stages: createStageState(),
    logs: ["Pipeline simulator ready. Configure target and scenario, then run."],
    artifacts: [],
    env: {
      dev: "not_deployed",
      uat: "not_deployed",
      production: "not_deployed",
    },
    selectedStage: "source",
  };
}

export const pipelineInitialState = initialState();

function withLog(state: PipelineState, line: string): PipelineState {
  return { ...state, logs: [...state.logs, `[t+${state.tick}] ${line}`] };
}

function stageDuration(stage: StageState, currentTick: number): number {
  if (stage.startedTick === null) {
    return 0;
  }

  const end = stage.endedTick ?? currentTick;
  return Math.max(0, end - stage.startedTick + 1);
}

export function getStageDuration(state: PipelineState, stage: StageKey): number {
  return stageDuration(state.stages[stage], state.tick);
}

function setStageStatus(state: PipelineState, stage: StageKey, status: StageStatus): PipelineState {
  const current = state.stages[stage];
  const startedTick =
    current.startedTick === null && (status === "running" || status === "success" || status === "failed" || status === "rolled_back")
      ? state.tick
      : current.startedTick;

  const endedTick =
    status === "success" || status === "failed" || status === "rolled_back" || status === "skipped"
      ? state.tick
      : status === "running" || status === "waiting_approval"
        ? null
        : current.endedTick;

  return {
    ...state,
    stages: {
      ...state.stages,
      [stage]: {
        status,
        startedTick,
        endedTick,
      },
    },
  };
}

function markDownstreamBlocked(state: PipelineState, failingStage: StageKey): PipelineState {
  const index = STAGE_ORDER.indexOf(failingStage);
  let next = state;

  for (const stage of STAGE_ORDER.slice(index + 1)) {
    if (stage === "rollback") {
      continue;
    }

    if (next.stages[stage].status === "idle") {
      next = setStageStatus(next, stage, "blocked");
    }
  }

  return next;
}

function advanceToStage(state: PipelineState, stage: StageKey): PipelineState {
  const currentStatus = state.stages[stage].status;
  if (currentStatus === "idle") {
    return withLog(setStageStatus(state, stage, "running"), `${STAGE_LABELS[stage]} started.`);
  }

  return state;
}

function completeStage(state: PipelineState, stage: StageKey): PipelineState {
  let next = setStageStatus(state, stage, "success");

  if (stage === "build") {
    next = { ...next, artifacts: [...next.artifacts, `webapp_${next.runId}.zip`, `infra_${next.runId}.plan`] };
  }

  if (stage === "devDeployment") {
    next = { ...next, env: { ...next.env, dev: "deployed" } };
  }

  if (stage === "uatApproval") {
    next = { ...next, env: { ...next.env, uat: "deployed" } };
  }

  if (stage === "productionApproval") {
    next = { ...next, env: { ...next.env, production: "deployed" } };
  }

  return withLog(next, `${STAGE_LABELS[stage]} completed successfully.`);
}

function runFailure(state: PipelineState, stage: StageKey, reason: string): PipelineState {
  let next = withLog(setStageStatus(state, stage, "failed"), `${STAGE_LABELS[stage]} failed: ${reason}`);
  next = markDownstreamBlocked(next, stage);

  if (stage === "devDeployment") {
    next = { ...next, env: { ...next.env, dev: "blocked" } };
    next = withLog(advanceToStage(next, "rollback"), "Rollback initiated due to deployment failure.");
    return { ...next, isRunning: true, isPaused: false, awaitingProductionApproval: false };
  }

  return {
    ...next,
    isRunning: false,
    isPaused: false,
    awaitingProductionApproval: false,
    env: {
      ...next.env,
      ...(stage === "testQuality" || stage === "securityScan" ? { dev: "blocked", uat: "blocked", production: "blocked" } : {}),
    },
  };
}

function shouldSkipStage(target: DeploymentTarget, stage: StageKey): boolean {
  if (stage === "rollback") {
    return true;
  }

  if (target === "dev") {
    return stage === "uatApproval" || stage === "productionApproval";
  }

  if (target === "uat") {
    return stage === "productionApproval";
  }

  return false;
}

function nextExecutableStage(state: PipelineState, fromIndex: number): StageKey | null {
  for (const stage of STAGE_ORDER.slice(fromIndex + 1)) {
    if (shouldSkipStage(state.target, stage)) {
      state = setStageStatus(state, stage, "skipped");
      continue;
    }

    if (stage === "rollback") {
      return null;
    }

    return stage;
  }

  return null;
}

function processTick(state: PipelineState): PipelineState {
  if (!state.isRunning || state.isPaused) {
    return state;
  }

  let next = { ...state, tick: state.tick + 1 };

  const active = STAGE_ORDER.find((stage) => next.stages[stage].status === "running");

  if (!active) {
    const firstStage = STAGE_ORDER.find((stage) => stage !== "rollback");
    if (!firstStage) {
      return next;
    }

    return advanceToStage(next, firstStage);
  }

  const duration = getStageDuration(next, active);
  if (duration < DURATIONS[active]) {
    return next;
  }

  if (active === "testQuality" && next.failureScenario === "test_failure") {
    return runFailure(next, active, "Quality gates did not pass.");
  }

  if (active === "securityScan" && next.failureScenario === "security_failure") {
    return runFailure(next, active, "Security gate reported policy violations.");
  }

  if (active === "devDeployment" && next.failureScenario === "deployment_failure") {
    return runFailure(next, active, "Deployment health checks failed in Dev.");
  }

  if (active === "rollback") {
    let rolled = setStageStatus(next, active, "rolled_back");
    rolled = {
      ...rolled,
      isRunning: false,
      isPaused: false,
      env: {
        ...rolled.env,
        dev: "rolled_back",
      },
    };
    return withLog(rolled, "Rollback completed. Downstream stages remain blocked pending investigation.");
  }

  next = completeStage(next, active);

  if (active === "productionApproval") {
    return { ...next, isRunning: false, isPaused: false, awaitingProductionApproval: false };
  }

  const currentIndex = STAGE_ORDER.indexOf(active);
  const nextStage = nextExecutableStage(next, currentIndex);

  if (!nextStage) {
    return { ...next, isRunning: false, isPaused: false, awaitingProductionApproval: false };
  }

  if (nextStage === "productionApproval" && next.target === "production") {
    let waiting = setStageStatus(next, nextStage, "waiting_approval");
    waiting = {
      ...waiting,
      isRunning: false,
      isPaused: false,
      awaitingProductionApproval: true,
      env: {
        ...waiting.env,
        production: "pending_approval",
      },
    };
    return withLog(waiting, "Production deployment requires manual approval.");
  }

  return advanceToStage(next, nextStage);
}

function startRun(state: PipelineState): PipelineState {
  let next = initialState(state.target, state.failureScenario);
  next = {
    ...next,
    runId: state.runId + 1,
    isRunning: true,
    logs: [...next.logs, "Pipeline run started."],
  };

  return next;
}

export function pipelineReducer(state: PipelineState, action: PipelineAction): PipelineState {
  switch (action.type) {
    case "set_target":
      if (state.isRunning || state.awaitingProductionApproval) {
        return state;
      }
      return { ...state, target: action.target };

    case "set_failure_scenario":
      if (state.isRunning || state.awaitingProductionApproval) {
        return state;
      }
      return { ...state, failureScenario: action.scenario };

    case "run":
      if (state.isRunning) {
        return state;
      }
      return startRun(state);

    case "tick":
      return processTick(state);

    case "pause_resume":
      if (!state.isRunning) {
        return state;
      }
      return {
        ...state,
        isPaused: !state.isPaused,
        logs: [...state.logs, `[t+${state.tick}] ${state.isPaused ? "Pipeline resumed." : "Pipeline paused."}`],
      };

    case "approve_production":
      if (!state.awaitingProductionApproval || state.stages.productionApproval.status !== "waiting_approval") {
        return state;
      }
      return withLog(
        {
          ...setStageStatus(state, "productionApproval", "running"),
          isRunning: true,
          isPaused: false,
          awaitingProductionApproval: false,
        },
        "Manual approval granted for Production."
      );

    case "select_stage":
      return { ...state, selectedStage: action.stage };

    case "reset": {
      const reset = initialState(state.target, state.failureScenario);
      return { ...reset, runId: state.runId + 1, selectedStage: state.selectedStage };
    }

    default:
      return state;
  }
}
