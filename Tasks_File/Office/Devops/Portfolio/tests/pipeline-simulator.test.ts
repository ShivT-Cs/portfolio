import test from "node:test";
import assert from "node:assert/strict";
import { pipelineInitialState, pipelineReducer } from "../lib/pipeline-simulator.js";
import type { PipelineState } from "../lib/pipeline-simulator.js";

function runUntilStopped(state: PipelineState, maxTicks = 80): PipelineState {
  let next = state;
  for (let i = 0; i < maxTicks && next.isRunning; i += 1) {
    next = pipelineReducer(next, { type: "tick" });
  }
  return next;
}

test("production target requires manual approval", () => {
  let state = pipelineReducer(pipelineInitialState, { type: "set_target", target: "production" });
  state = pipelineReducer(state, { type: "run" });
  state = runUntilStopped(state);

  assert.equal(state.awaitingProductionApproval, true);
  assert.equal(state.stages.productionApproval.status, "waiting_approval");

  state = pipelineReducer(state, { type: "approve_production" });
  state = runUntilStopped(state);
  assert.equal(state.stages.productionApproval.status, "success");
  assert.equal(state.env.production, "deployed");
});

test("test failure blocks downstream stages", () => {
  let state = pipelineReducer(pipelineInitialState, { type: "set_failure_scenario", scenario: "test_failure" });
  state = pipelineReducer(state, { type: "run" });
  state = runUntilStopped(state);

  assert.equal(state.stages.testQuality.status, "failed");
  assert.equal(state.stages.securityScan.status, "blocked");
  assert.equal(state.stages.devDeployment.status, "blocked");
  assert.equal(state.isRunning, false);
});

test("deployment failure triggers rollback path", () => {
  let state = pipelineReducer(pipelineInitialState, { type: "set_failure_scenario", scenario: "deployment_failure" });
  state = pipelineReducer(state, { type: "run" });
  state = runUntilStopped(state);

  assert.equal(state.stages.devDeployment.status, "failed");
  assert.equal(state.stages.rollback.status, "rolled_back");
  assert.equal(state.env.dev, "rolled_back");
});

test("pause and resume control tick progress", () => {
  let state = pipelineReducer(pipelineInitialState, { type: "run" });
  state = pipelineReducer(state, { type: "tick" });
  const tickBeforePause = state.tick;

  state = pipelineReducer(state, { type: "pause_resume" });
  const pausedTick = pipelineReducer(state, { type: "tick" });
  assert.equal(pausedTick.tick, tickBeforePause);

  state = pipelineReducer(pausedTick, { type: "pause_resume" });
  state = pipelineReducer(state, { type: "tick" });
  assert.equal(state.tick, tickBeforePause + 1);
});
