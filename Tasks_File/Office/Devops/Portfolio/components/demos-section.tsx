import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";

export function DemosSection() {
  return (
    <section id="demos" className="mx-auto max-w-6xl px-4 py-20 md:px-6" aria-labelledby="demos-heading">
      <div className="section-divider" />
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-accentSoft">Interactive Demos</p>
        <h2 id="demos-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
          Technical simulations for delivery and AIOps workflows
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Portfolio demonstrations using deterministic local logic, sanitized architecture context, and no live cloud integration.
        </p>
      </header>

      <MotionWrapper>
        <div className="mt-8 grid gap-5">
          <article className="rounded-2xl border border-white/12 bg-panel/70 p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accentSoft">
                  Azure DevOps Demo
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-ink">Azure DevOps Release Pipeline Simulator</h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                  Simulates end-to-end release flow including quality and security gates, UAT/Production approvals, failure paths,
                  and rollback behavior with deterministic local state transitions.
                </p>
              </div>
              <Link
                href="/demos/azure-devops-pipeline"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-accent/45 bg-accent/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Try Interactive Demo <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/12 bg-panel/70 p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex rounded-full border border-emerald-300/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                  AIOps Demo
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-ink">AIOps Incident Intelligence Lab</h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                  Generates synthetic telemetry, correlates deterministic incident signals, and walks through explainable probable-cause
                  evidence, human approval gates, and incident lifecycle controls.
                </p>
              </div>
              <Link
                href="/demos/aiops-incident-lab"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-emerald-300 hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Try Interactive Demo <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </MotionWrapper>
    </section>
  );
}
