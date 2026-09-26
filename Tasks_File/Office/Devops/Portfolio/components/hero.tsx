import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profile } from "@/content/profile";
import { socialLinks } from "@/content/social";
import { MotionWrapper } from "@/components/motion-wrapper";
import { AzureArchitectureMap } from "@/components/azure-architecture-map";

const linkedIn = socialLinks.find((item) => item.label === "LinkedIn")?.href ?? "#";
const github = socialLinks.find((item) => item.label === "GitHub")?.href ?? "#";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pb-16 pt-20 md:px-6 md:pb-20 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-radialGrid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentSoft/60 to-transparent" />
      <div className="pointer-events-none absolute left-[-12%] top-[12%] h-64 w-64 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-15%] top-[24%] h-72 w-72 rounded-full bg-[#15418f]/30 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <MotionWrapper>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accentSoft">Azure Solutions Architect and Cloud Engineer</p>
            <h1 className="mt-6 max-w-4xl font-[var(--font-heading)] text-4xl font-semibold leading-[1.05] text-ink md:text-6xl xl:text-[4.2rem]">
              {profile.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.role}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{profile.summary}</p>

            <div className="mt-7 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.22em] text-muted">
              Azure architecture | DevOps | Platform engineering | DevSecOps | SRE mindset
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentSoft"
              >
                View Projects <ArrowRight size={16} />
              </a>
              <a
                href={profile.resumePath}
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-ink transition hover:border-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                download
              >
                Download Resume
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-muted">
              <Link
                href={linkedIn}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md px-2 transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </Link>
              <Link
                href={github}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md px-2 transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
            </div>

            <div aria-hidden className="topology-canvas mt-10">
              <span className="topology-node topology-node-a" />
              <span className="topology-node topology-node-b" />
              <span className="topology-node topology-node-c" />
              <span className="topology-node topology-node-d" />
              <span className="topology-node topology-node-e" />
              <svg viewBox="0 0 100 28" className="topology-lines" focusable="false">
                <path d="M2 19 C15 8, 23 8, 35 14" />
                <path d="M35 14 C47 20, 61 24, 73 18" />
                <path d="M35 14 C47 9, 59 8, 73 11" />
                <path d="M73 11 C84 12, 90 14, 97 17" />
              </svg>
            </div>
          </div>
        </MotionWrapper>

        <AzureArchitectureMap />
      </div>
    </section>
  );
}
