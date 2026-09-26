import test from "node:test";
import assert from "node:assert/strict";
import {
  aiopsLabInitialState,
  aiopsLabReducer,
  correlateAlerts,
  createIncidentPayload,
  telemetryForWindow,
} from "../lib/aiops-incident-lab.js";

test("correlation rule matches expected deployment failure signals", () => {
  const telemetry = telemetryForWindow("deployment_failure", "30m");
  const correlations = correlateAlerts(telemetry, "deployment_failure");

  assert.equal(correlations.length, 1);
  assert.equal(correlations[0]?.ruleId, "RULE-DEPLOY-FAIL-03");
  assert.ok(correlations[0]?.matchedEventIds.length && correlations[0]?.matchedEventIds.length >= 3);
});

test("scenario selection refreshes telemetry and resets lifecycle state", () => {
  const moved = aiopsLabReducer(aiopsLabInitialState, { type: "set_scenario", scenario: "storage_throttling" });

  assert.equal(moved.scenario, "storage_throttling");
  assert.equal(moved.incidentStatus, "new");
  assert.equal(moved.remediationApproved, false);
  assert.equal(moved.assignee, "");
  assert.ok(moved.telemetry.some((event) => event.signal === "Storage Throttled Requests"));
});

test("incident lifecycle follows enforced state transitions", () => {
  let state = aiopsLabReducer(aiopsLabInitialState, { type: "generate_incident" });
  state = aiopsLabReducer(state, { type: "acknowledge" });
  state = aiopsLabReducer(state, { type: "assign", assignee: "SRE Oncall" });
  state = aiopsLabReducer(state, { type: "start_investigation" });

  assert.equal(state.incidentStatus, "investigating");
  assert.equal(state.assignee, "SRE Oncall");

  const invalidClose = aiopsLabReducer(state, { type: "close" });
  assert.equal(invalidClose.incidentStatus, "investigating");
});

test("remediation execution requires approval before resolve", () => {
  let state = aiopsLabReducer(aiopsLabInitialState, { type: "acknowledge" });
  state = aiopsLabReducer(state, { type: "assign", assignee: "Ops Engineer" });
  state = aiopsLabReducer(state, { type: "start_investigation" });

  const blockedExecution = aiopsLabReducer(state, { type: "execute_remediation" });
  assert.equal(blockedExecution.remediationExecuted, false);

  state = aiopsLabReducer(state, { type: "approve_remediation" });
  state = aiopsLabReducer(state, { type: "execute_remediation" });
  state = aiopsLabReducer(state, { type: "resolve" });
  state = aiopsLabReducer(state, { type: "close" });

  assert.equal(state.remediationExecuted, true);
  assert.equal(state.incidentStatus, "closed");

  const payload = createIncidentPayload(state);
  assert.equal(payload.deterministicCorrelationRules, true);
  assert.equal(payload.syntheticTelemetry, true);
});
