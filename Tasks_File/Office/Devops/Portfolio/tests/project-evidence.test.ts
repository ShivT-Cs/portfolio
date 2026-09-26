import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects } from "../content/projects.js";
import { getProjectEvidence, listEvidenceCoverage } from "../content/project-evidence.js";

test("every case study has a centralized evidence record", () => {
  for (const project of projects) {
    const evidence = getProjectEvidence(project.slug);
    assert.ok(evidence, `Missing evidence record for slug: ${project.slug}`);
  }
});

test("implemented file artifacts reference real repository files when marked implemented", () => {
  for (const project of projects) {
    const evidence = getProjectEvidence(project.slug);
    assert.ok(evidence);

    for (const artifact of evidence.implementedFiles) {
      if (artifact.status === "implemented") {
        assert.equal(existsSync(artifact.path), true, `Implemented artifact file missing: ${artifact.path}`);
      }
    }
  }
});

test("demo routes in evidence match known demo routes or case-study demoUrl", () => {
  const allowedDemoRoutes = new Set<string>(["/demos/azure-devops-pipeline", "/demos/aiops-incident-lab"]);

  for (const project of projects) {
    const evidence = getProjectEvidence(project.slug);
    assert.ok(evidence);

    for (const demo of evidence.demoRoutes) {
      assert.equal(allowedDemoRoutes.has(demo.route), true, `Unexpected demo route in evidence: ${demo.route}`);
    }

    if (project.demoUrl) {
      assert.equal(
        evidence.demoRoutes.some((entry) => entry.route === project.demoUrl),
        true,
        `Evidence should include project demo route ${project.demoUrl} for ${project.slug}`
      );
    }
  }
});

test("coverage utility returns all case studies", () => {
  const coverage = listEvidenceCoverage();
  assert.equal(coverage.length, projects.length);

  const withEvidencePending = coverage.filter((entry) => entry.hasPending);
  assert.ok(withEvidencePending.length >= 1);
});

test("landing zone evidence explicitly marks Azure deployment as not performed", () => {
  const evidence = getProjectEvidence("azure-landing-zone-iac-modules");
  assert.ok(evidence);

  assert.match(evidence.verificationStatus.azureDeployment, /Not performed \/ Evidence pending/i);
  assert.equal(
    evidence.evidencePending.some((item) => /Not performed \/ Evidence pending/i.test(item)),
    true,
    "Landing zone evidence should keep Azure deployment verification pending"
  );
});
