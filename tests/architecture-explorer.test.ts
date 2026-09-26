import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  getAllArchitectureDiagrams,
  getArchitectureDiagram,
  validateAllDiagrams,
} from "../lib/architecture-explorer-data.js";
import { ArchitectureExplorer } from "../components/architecture-explorer.js";

test("all architecture diagrams pass schema and sanitization validation", () => {
  const results = validateAllDiagrams();

  assert.equal(results.length, 10);
  for (const result of results) {
    assert.equal(result.valid, true, `${result.id} failed validation: ${result.errors.join("; ")}`);
  }
});

test("architecture dataset covers eight case studies and two demos", () => {
  const diagrams = getAllArchitectureDiagrams();
  const ids = new Set(diagrams.map((item) => item.id));

  const expectedIds = [
    "azure-landing-zone-iac-modules",
    "multi-environment-cicd-angular-dotnet-sql",
    "aks-platform-engineering",
    "blob-malware-scanning-defender-storage",
    "azure-devops-workload-visibility-powerbi",
    "azure-ai-rag-infrastructure",
    "azure-aiops-incident-intelligence",
    "aks-aiops-platform-reliability",
    "demo-azure-devops-pipeline",
    "demo-aiops-incident-lab",
  ];

  for (const id of expectedIds) {
    assert.equal(ids.has(id), true, `Missing architecture diagram id: ${id}`);
  }
});

test("reusable explorer renders legend, flow direction, and detail panel", () => {
  const html = renderToStaticMarkup(createElement(ArchitectureExplorer, { diagramId: "azure-ai-rag-infrastructure" }));

  assert.match(html, /Architecture Explorer/);
  assert.match(html, /Legend/);
  assert.match(html, /Data flow:/);
  assert.match(html, /Component Details/);
  assert.match(html, /RAG Infrastructure/);
});

test("diagram lookup returns expected classification metadata", () => {
  const caseStudy = getArchitectureDiagram("azure-aiops-incident-intelligence");
  const demo = getArchitectureDiagram("demo-azure-devops-pipeline");

  assert.ok(caseStudy);
  assert.ok(demo);
  assert.equal(caseStudy?.classification, "reference");
  assert.equal(demo?.classification, "implemented_verified");
});
