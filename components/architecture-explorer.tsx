"use client";

import { useMemo, useState } from "react";
import {
  getArchitectureDiagram,
  getClassificationLabel,
  ArchitectureDiagram,
  ArchitectureNode,
  ArchitectureConnection,
} from "../lib/architecture-explorer-data";

type ArchitectureExplorerProps = {
  diagramId: string;
  className?: string;
};

function connectionPath(from: ArchitectureNode, to: ArchitectureNode): string {
  const startX = from.x;
  const startY = from.y;
  const endX = to.x;
  const endY = to.y;
  const midX = (startX + endX) / 2;
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
}

function arrowForDirection(direction: ArchitectureConnection["direction"]): string {
  switch (direction) {
    case "bidirectional":
      return "<->";
    case "event":
      return "~>";
    default:
      return "->";
  }
}

function classificationTone(classification: ArchitectureDiagram["classification"]): string {
  switch (classification) {
    case "implemented_verified":
      return "border-emerald-300/45 bg-emerald-500/12 text-emerald-100";
    case "proposed":
      return "border-amber-300/45 bg-amber-500/12 text-amber-100";
    default:
      return "border-sky-300/45 bg-sky-500/12 text-sky-100";
  }
}

export function ArchitectureExplorer({ diagramId, className = "" }: ArchitectureExplorerProps) {
  const diagram = getArchitectureDiagram(diagramId);
  const [zoom, setZoom] = useState(1);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(diagram?.nodes[0]?.id ?? null);

  const nodeMap = useMemo(() => new Map((diagram?.nodes ?? []).map((node) => [node.id, node])), [diagram]);
  const activeNode = activeNodeId ? nodeMap.get(activeNodeId) : undefined;

  if (!diagram) {
    return (
      <section className={`rounded-xl border border-rose-300/35 bg-rose-500/10 p-4 text-sm text-rose-100 ${className}`}>
        Architecture explorer data is not available for this route.
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-white/12 bg-panel/70 p-4 md:p-6 ${className}`} aria-label={`${diagram.title} architecture explorer`}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Architecture Explorer</h3>
          <p className="mt-1 text-sm text-muted">{diagram.title}: {diagram.subtitle}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${classificationTone(diagram.classification)}`}>
          {getClassificationLabel(diagram.classification)}
        </span>
      </header>

      <div className="mt-4 rounded-xl border border-white/12 bg-surface/60 p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.14em] text-accentSoft">Data flow: {diagram.dataFlowDirection}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((current) => Math.max(0.8, Number((current - 0.1).toFixed(2))))}
              className="min-h-[36px] rounded-md border border-white/20 px-3 text-xs text-ink hover:border-accent"
              aria-label="Zoom out architecture diagram"
            >
              Zoom-
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="min-h-[36px] rounded-md border border-white/20 px-3 text-xs text-ink hover:border-accent"
              aria-label="Reset architecture zoom"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setZoom((current) => Math.min(1.6, Number((current + 0.1).toFixed(2))))}
              className="min-h-[36px] rounded-md border border-white/20 px-3 text-xs text-ink hover:border-accent"
              aria-label="Zoom in architecture diagram"
            >
              Zoom+
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted">Accessible alternative: use the component buttons below to inspect architecture details without zoom.</p>

        <div className="mt-4 overflow-auto rounded-lg border border-white/12 bg-panel/60 p-3">
          <div className="min-w-[640px]">
            <div className="relative aspect-[16/8] origin-top-left motion-safe:transition-transform motion-reduce:transition-none" style={{ transform: `scale(${zoom})` }}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-label={`${diagram.title} sanitized architecture diagram`}>
                <g stroke="rgba(99,176,255,0.72)" strokeWidth="0.45" fill="none" strokeDasharray="1.4 1.4">
                  {diagram.connections.map((connection) => {
                    const fromNode = nodeMap.get(connection.from);
                    const toNode = nodeMap.get(connection.to);
                    if (!fromNode || !toNode) {
                      return null;
                    }
                    return <path key={connection.id} d={connectionPath(fromNode, toNode)} className="flow-line" />;
                  })}
                </g>
              </svg>

              {diagram.nodes.map((node) => {
                const isActive = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[11px] font-medium tracking-[0.08em] transition motion-reduce:transition-none ${
                      isActive
                        ? "border-accent bg-accent/25 text-ink shadow-[0_0_0_1px_rgba(88,165,255,0.2)]"
                        : "border-white/20 bg-surface/90 text-muted hover:border-accent/50"
                    }`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-pressed={isActive}
                    aria-label={`Inspect ${node.label}`}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Legend</h4>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs">
              {diagram.groups.map((group) => (
                <li key={group.id} className={`rounded-full border px-2 py-1 ${group.toneClass}`}>
                  {group.label}
                </li>
              ))}
            </ul>
            <ul className="mt-3 space-y-1 text-xs text-muted">
              {diagram.connections.map((connection) => {
                const fromNode = nodeMap.get(connection.from);
                const toNode = nodeMap.get(connection.to);
                if (!fromNode || !toNode) {
                  return null;
                }
                return (
                  <li key={connection.id}>
                    {fromNode.label} {arrowForDirection(connection.direction)} {toNode.label}
                    {connection.label ? ` (${connection.label})` : ""}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border border-white/12 bg-surface/60 p-4" aria-live="polite">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-accentSoft">Component Details</h4>
            {activeNode ? (
              <div className="mt-3 space-y-3 text-sm text-muted">
                <p className="text-base font-semibold text-ink">{activeNode.label}</p>
                <p>{activeNode.purpose}</p>
                <p><span className="text-ink">Responsibilities:</span> {activeNode.responsibilities.join(" | ")}</p>
                <p><span className="text-ink">Security controls:</span> {activeNode.securityControls.join(" | ")}</p>
                <p><span className="text-ink">Dependencies:</span> {activeNode.dependencies.join(" | ")}</p>
                <p><span className="text-ink">Design decisions:</span> {activeNode.designDecisions.join(" | ")}</p>
                {activeNode.annotations?.length ? (
                  <p><span className="text-ink">Annotations:</span> {activeNode.annotations.join(" | ")}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Select a component to inspect architecture decisions and controls.</p>
            )}
          </div>
        </div>

        {diagram.annotations?.length ? (
          <ul className="mt-4 space-y-1 text-xs text-muted">
            {diagram.annotations.map((note) => (
              <li key={note} className="rounded-md border border-white/10 bg-surface/50 px-2 py-1">
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
