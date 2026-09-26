import test from "node:test";
import assert from "node:assert/strict";
import {
  composeKeyVaultName,
  composeResourceGroupName,
  hasSensitiveTokens,
  isValidEnvironment,
  isValidKeyVaultPrefix,
  isValidProjectName,
} from "../lib/landing-zone-iac-rules.js";

test("project name validation matches module naming rules", () => {
  assert.equal(isValidProjectName("landingzone"), true);
  assert.equal(isValidProjectName("lz-demo-01"), true);
  assert.equal(isValidProjectName("LZ-UPPER"), false);
  assert.equal(isValidProjectName("ab"), false);
  assert.equal(isValidProjectName("name_with_underscore"), false);
});

test("environment validation allows only approved values", () => {
  assert.equal(isValidEnvironment("dev"), true);
  assert.equal(isValidEnvironment("test"), true);
  assert.equal(isValidEnvironment("stage"), false);
});

test("key vault prefix validation and composition are deterministic", () => {
  assert.equal(isValidKeyVaultPrefix("lzvault"), true);
  assert.equal(isValidKeyVaultPrefix("LZVAULT"), false);

  const composed = composeKeyVaultName("lz-vault", "123456");
  assert.equal(composed.includes("-"), false);
  assert.ok(composed.length <= 24);
});

test("resource group naming convention is stable", () => {
  assert.equal(composeResourceGroupName("hub"), "rg-hub");
  assert.equal(composeResourceGroupName("workload"), "rg-workload");
});

test("sensitive token detection flags unsafe content", () => {
  assert.equal(hasSensitiveTokens("location = \"westeurope\""), false);
  assert.equal(hasSensitiveTokens("client_secret = \"secret\""), true);
  assert.equal(hasSensitiveTokens("tenant_id = \"0000\""), true);
});
