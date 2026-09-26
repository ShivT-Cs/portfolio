import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "infrastructure/landing-zone/main.tf",
  "infrastructure/landing-zone/variables.tf",
  "infrastructure/landing-zone/outputs.tf",
  "infrastructure/landing-zone/versions.tf",
  "infrastructure/landing-zone/terraform.tfvars.example",
  "infrastructure/landing-zone/modules/resource-group/main.tf",
  "infrastructure/landing-zone/modules/networking/main.tf",
  "infrastructure/landing-zone/modules/key-vault/main.tf",
  ".github/workflows/landing-zone-iac-checks.yml",
  "public/diagrams/landing-zone-sanitized.svg",
  "infrastructure/landing-zone/README.md",
];

test("landing zone IaC required files exist", () => {
  for (const filePath of requiredFiles) {
    assert.equal(existsSync(filePath), true, `Expected file to exist: ${filePath}`);
  }
});

test("landing zone root configuration composes reusable modules", () => {
  const mainTf = readFileSync("infrastructure/landing-zone/main.tf", "utf8");

  assert.match(mainTf, /module\s+"resource_groups"/);
  assert.match(mainTf, /source\s*=\s*"\.\/modules\/resource-group"/);
  assert.match(mainTf, /module\s+"networking"/);
  assert.match(mainTf, /source\s*=\s*"\.\/modules\/networking"/);
  assert.match(mainTf, /module\s+"key_vault"/);
  assert.match(mainTf, /source\s*=\s*"\.\/modules\/key-vault"/);
});

test("input variable validations are present", () => {
  const varsTf = readFileSync("infrastructure/landing-zone/variables.tf", "utf8");

  assert.match(varsTf, /variable\s+"project_name"/);
  assert.match(varsTf, /validation\s*\{/);
  assert.match(varsTf, /variable\s+"environment"/);
  assert.match(varsTf, /contains\(\["dev",\s*"test",\s*"prod",\s*"demo"\]/);
  assert.match(varsTf, /variable\s+"network"/);
  assert.match(varsTf, /length\(var\.network\.subnets\)\s*>=\s*2/);
});

test("example tfvars are sanitized", () => {
  const tfvars = readFileSync("infrastructure/landing-zone/terraform.tfvars.example", "utf8").toLowerCase();

  const forbiddenSnippets = ["subscription_id", "tenant_id", "client_secret", "password", "token", "apikey"];
  for (const snippet of forbiddenSnippets) {
    assert.equal(tfvars.includes(snippet), false, `tfvars.example should not contain sensitive key: ${snippet}`);
  }
});

test("README includes reproducible local validation commands", () => {
  const readme = readFileSync("infrastructure/landing-zone/README.md", "utf8");

  assert.match(readme, /terraform fmt -check -recursive/);
  assert.match(readme, /terraform init -backend=false/);
  assert.match(readme, /terraform validate/);
  assert.match(readme, /terraform plan -refresh=false -var-file=terraform\.tfvars\.example/);
  assert.match(readme, /tofu fmt -check -recursive/);
  assert.match(readme, /does not perform `apply`/i);
  assert.match(readme, /Not performed \/ Evidence pending/i);
});

test("workflow is credential-free and does not perform deployment", () => {
  const workflow = readFileSync(".github/workflows/landing-zone-iac-checks.yml", "utf8");

  assert.match(workflow, /terraform fmt -check -recursive/);
  assert.match(workflow, /terraform init -backend=false -input=false/);
  assert.match(workflow, /terraform validate/);
  assert.match(workflow, /terraform plan -input=false -lock=false/);
  assert.match(workflow, /tfsec-action/);
  assert.doesNotMatch(workflow, /terraform apply/);
  assert.doesNotMatch(workflow, /az login/);
});
