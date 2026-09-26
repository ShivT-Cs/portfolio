import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MotionWrapper } from "@/components/motion-wrapper";
import { ConsultancyInquiryForm } from "@/components/consultancy-inquiry-form";
import { projects } from "@/content/projects";
import { getEvidenceClassificationLabel, getProjectEvidence } from "@/content/project-evidence";

export const metadata: Metadata = {
  title: "Consultancy | Azure, DevOps, Platform Engineering and AI Automation",
  description:
    "Freelance Azure, cloud, DevOps, platform engineering, Active Directory, security, and AI automation consulting services for India and international clients.",
};

const serviceAreas = [
  {
    title: "Azure Cloud Architecture and Consulting",
    details:
      "Azure foundations, landing zones, networking, identity, RBAC, architecture decisions, governance controls, cost awareness, and reliability planning.",
  },
  {
    title: "Cloud Migration and Business IT Onboarding",
    details:
      "Azure onboarding for business workloads, migration planning from on-premises or legacy systems, application/database/server/file migration, DNS, SSL, backup, and monitoring setup.",
  },
  {
    title: "DevOps and Platform Engineering",
    details:
      "Azure DevOps and GitHub Actions pipelines, Terraform/OpenTofu, CI/CD workflows, Docker and AKS patterns, reusable modules, golden paths, DevSecOps controls, and observability foundations.",
  },
  {
    title: "Microsoft Active Directory and IT Automation",
    details:
      "On-premises AD DS consulting for domain controllers, domain and forest architecture, OUs, GPOs, PowerShell automation, replication health, and DNS. Hybrid identity with Microsoft Entra ID is addressed separately from AD DS domain services.",
  },
  {
    title: "Cloud Security, Governance and Reliability",
    details:
      "Azure security posture reviews, Defender for Cloud alignment, BCDR planning, backup strategies, monitoring and incident response design, governance policy baselines, and cost optimization controls.",
  },
  {
    title: "AI Agents and Intelligent Business Automation",
    details:
      "RAG and knowledge assistant architecture, document processing and ticket triage workflows, Azure AI Foundry foundations, enterprise integrations, evaluation loops, human approval gates, and responsible deployment controls.",
  },
  {
    title: "IT Architecture and Technical Advisory",
    details:
      "Current-state assessments, HLD/LLD deliverables, modernization roadmaps, technology selection, engineering standards, and technical mentoring for internal teams.",
  },
];

const engagementModels = [
  "Project-based consulting",
  "Part-time consulting",
  "Ongoing technical partnership",
  "Architecture advisory",
];

const consultingPackages = [
  {
    title: "Cloud Readiness and Architecture Assessment",
    scope:
      "Assessment of current workloads, constraints, risks, and target Azure architecture options across identity, networking, governance, and operations.",
    deliverables: [
      "Assessment summary with risk and dependency mapping",
      "Target-state architecture recommendations",
      "Prioritized roadmap for staged implementation",
    ],
  },
  {
    title: "Cloud Foundation and Business Onboarding",
    scope:
      "Build or refine Azure foundations for organization onboarding, including landing-zone controls, baseline operations, and workload onboarding guidance.",
    deliverables: [
      "Foundation design artifacts and implementation checklist",
      "Governance and security baseline recommendations",
      "Onboarding playbook for application and team adoption",
    ],
  },
  {
    title: "DevOps Foundation and CI/CD",
    scope:
      "Design and implement reusable delivery pipelines and DevSecOps checkpoints for reliable multi-environment releases.",
    deliverables: [
      "CI/CD architecture and pipeline template structure",
      "Release governance gates and environment promotion strategy",
      "Operational handover notes for engineering teams",
    ],
  },
  {
    title: "AI Automation Proof of Concept",
    scope:
      "Validate a practical automation use case using AI-assisted workflows, with clear controls for data handling, human review, and deployment boundaries.",
    deliverables: [
      "PoC architecture and workflow definition",
      "Evaluation approach and acceptance criteria",
      "Decision memo for production-readiness next steps",
    ],
  },
];

const deliveryProcess = [
  {
    title: "Discover and assess",
    text: "Understand business objectives, current architecture, delivery constraints, and risk profile.",
  },
  {
    title: "Design and plan",
    text: "Define target architecture, implementation approach, priorities, and governance checkpoints.",
  },
  {
    title: "Implement and validate",
    text: "Execute scoped work, validate technical outcomes, and document operational considerations.",
  },
  {
    title: "Handover and support",
    text: "Share documentation and walkthroughs, then support your team through adoption and follow-up refinements.",
  },
];

const selectedWork = [
  "azure-landing-zone-iac-modules",
  "multi-environment-cicd-angular-dotnet-sql",
  "azure-ai-rag-infrastructure",
  "azure-aiops-incident-intelligence",
] as const;

const faq = [
  {
    question: "Do you work remotely and with international clients?",
    answer:
      "Yes. Consulting is delivered remotely for clients in India and internationally, with communication and documentation aligned to agreed working methods.",
  },
  {
    question: "How is project scope defined?",
    answer:
      "Scope is defined through a discovery conversation and then documented with boundaries, assumptions, deliverables, and responsibilities.",
  },
  {
    question: "What deliverables should we expect?",
    answer:
      "Deliverables vary by engagement and can include architecture artifacts, implementation guidance, automation patterns, technical documentation, and handover sessions.",
  },
  {
    question: "Who owns cloud and tooling access?",
    answer:
      "Client environments and access remain client-owned. Least-privilege access should be provisioned by the client for agreed consulting activities.",
  },
  {
    question: "What does the engagement process look like?",
    answer:
      "Typical flow is discovery, planning, implementation, and handover. A practical cadence is agreed based on priorities, dependencies, and stakeholder availability.",
  },
];

function selectedWorkKind(slug: string, demoUrl?: string) {
  if (demoUrl) {
    return "Interactive simulation";
  }

  const evidence = getProjectEvidence(slug as (typeof projects)[number]["slug"]);
  if (!evidence) {
    return "Case-study reference";
  }

  return getEvidenceClassificationLabel(evidence.classification);
}

export default function ConsultancyPage() {
  const workItems = selectedWork
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 md:px-6 md:pt-20">
          <MotionWrapper>
            <div className="rounded-2xl border border-white/12 bg-panel/70 p-7 md:p-10">
              <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">Consultancy</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink md:text-5xl">Build. Modernize. Automate. Scale.</h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted">
                I provide freelance Azure Cloud, DevOps, Platform Engineering, Security, Active Directory, and AI automation consulting for Indian and international clients.
                Engagements are tailored to architecture quality, operational reliability, and practical delivery outcomes.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#inquiry"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-accent/45 bg-accent/20 px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Start a Project Inquiry <ArrowRight size={16} />
                </a>
                <Link
                  href="/#projects"
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/45 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Review Portfolio Work
                </Link>
              </div>
            </div>
          </MotionWrapper>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6" aria-labelledby="services-heading">
          <div className="section-divider" />
          <header className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">Services</p>
            <h2 id="services-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              End-to-end consulting across cloud architecture and engineering delivery
            </h2>
          </header>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {serviceAreas.map((service, index) => (
              <MotionWrapper key={service.title} delay={index * 0.04}>
                <article className="h-full rounded-2xl border border-white/12 bg-panel/65 p-6">
                  <h3 className="text-xl font-semibold text-ink">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{service.details}</p>
                </article>
              </MotionWrapper>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="section-divider" />
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/12 bg-panel/65 p-6">
              <h2 className="text-2xl font-semibold text-ink">Engagement models</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {engagementModels.map((model) => (
                  <li key={model} className="flex items-start gap-2 rounded-lg border border-white/10 bg-surface/50 px-3 py-2">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accentSoft" aria-hidden="true" />
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-white/12 bg-panel/65 p-6">
              <h2 className="text-2xl font-semibold text-ink">Delivery process</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted">
                {deliveryProcess.map((step, index) => (
                  <li key={step.title} className="rounded-lg border border-white/10 bg-surface/50 px-3 py-3">
                    <p className="text-ink">
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-1">{step.text}</p>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6" aria-labelledby="packages-heading">
          <div className="section-divider" />
          <header className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">Consulting Packages</p>
            <h2 id="packages-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              Structured starting points with clear scope and deliverables
            </h2>
          </header>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {consultingPackages.map((pkg) => (
              <article key={pkg.title} className="rounded-2xl border border-white/12 bg-panel/65 p-6">
                <h3 className="text-xl font-semibold text-ink">{pkg.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pkg.scope}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-accentSoft">Typical deliverables</p>
                <ul className="mt-2 space-y-2 text-sm text-muted">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="rounded-lg border border-white/10 bg-surface/50 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6" aria-labelledby="selected-work-heading">
          <div className="section-divider" />
          <header className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">Selected Work</p>
            <h2 id="selected-work-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              Case studies and interactive demos from this portfolio
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              This section reuses existing portfolio routes only. Labels identify whether an item is reference architecture evidence or an interactive simulation.
              No new client claims, testimonials, or production metrics are introduced here.
            </p>
          </header>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {workItems.map((item) => {
              const workType = selectedWorkKind(item.slug, item.demoUrl);

              return (
                <article key={item.slug} className="rounded-2xl border border-white/12 bg-panel/65 p-6">
                  <p className="inline-flex rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-accentSoft">
                    {workType}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.problem}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/projects/${item.slug}`}
                      className="inline-flex min-h-[42px] items-center rounded-lg border border-white/20 px-4 py-2 text-sm text-ink transition hover:border-accent/45 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Open Case Study
                    </Link>
                    {item.demoUrl ? (
                      <Link
                        href={item.demoUrl}
                        className="inline-flex min-h-[42px] items-center rounded-lg border border-accent/45 bg-accent/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Open Interactive Simulation
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-6 rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Production-verified work is not claimed on this page unless explicitly marked in existing evidence data.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6" aria-labelledby="faq-heading">
          <div className="section-divider" />
          <header className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">FAQ</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              Common questions before starting an engagement
            </h2>
          </header>

          <div className="mt-8 grid gap-4">
            {faq.map((item) => (
              <article key={item.question} className="rounded-2xl border border-white/12 bg-panel/65 p-5">
                <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="inquiry" className="mx-auto max-w-6xl px-4 pb-20 pt-14 md:px-6" aria-labelledby="inquiry-heading">
          <div className="section-divider" />
          <article className="rounded-2xl border border-white/12 bg-panel/70 p-6 md:p-8">
            <header className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-accentSoft">Project Inquiry</p>
              <h2 id="inquiry-heading" className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
                Share your scope and delivery priorities
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Submit your inquiry through this form. Delivery is handled server-side and email notifications are sent when configuration is available.
                Please avoid sharing credentials or secrets in your message.
              </p>
            </header>

            <ConsultancyInquiryForm />
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}