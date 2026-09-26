import { MotionWrapper } from "@/components/motion-wrapper";

const nodeClass =
  "rounded-lg border border-accent/35 bg-surface/85 px-2 py-1.5 text-[10px] font-medium leading-tight text-ink shadow-card sm:px-2.5 sm:text-[11px]";

export function AzureArchitectureMap() {
  return (
    <MotionWrapper delay={0.14}>
      <aside className="relative overflow-hidden rounded-2xl border border-white/15 bg-panel/75 p-4 shadow-card backdrop-blur md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(92,164,255,0.25),transparent_32%)]" />

        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.24em] text-accentSoft">Illustrative Azure Reference</p>
          <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] text-muted">
            Not a client architecture
          </span>
        </div>

        <svg
          className="relative mt-4 h-[240px] w-full text-accentSoft/65 sm:h-[280px] md:h-[320px]"
          viewBox="0 0 560 320"
          role="img"
          aria-label="Illustrative Azure architecture diagram"
        >
          <defs>
            <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#66B2FF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2F85FF" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <g stroke="url(#flow)" strokeWidth="1.4" fill="none" strokeDasharray="4 5">
            <path d="M62 80C124 82 158 84 214 86" className="flow-line" />
            <path d="M250 88C306 92 352 101 414 120" className="flow-line" />
            <path d="M250 88C298 126 350 166 414 212" className="flow-line" />
            <path d="M454 120C496 128 514 154 512 184" className="flow-line" />
            <path d="M454 212C490 206 513 202 518 190" className="flow-line" />
            <path d="M246 248C316 244 366 234 418 216" className="flow-line" />
            <path d="M246 248C294 264 336 276 418 282" className="flow-line" />
          </g>

          <circle cx="214" cy="86" r="4" fill="#66B2FF" className="pulse-node" />
          <circle cx="414" cy="120" r="4" fill="#66B2FF" className="pulse-node" />
          <circle cx="414" cy="212" r="4" fill="#66B2FF" className="pulse-node" />
          <circle cx="418" cy="282" r="4" fill="#66B2FF" className="pulse-node" />
        </svg>

        <div className="relative -mt-[240px] grid h-[240px] grid-cols-3 grid-rows-4 gap-2 sm:-mt-[280px] sm:h-[280px] sm:gap-3 md:-mt-[320px] md:h-[320px]">
          <div className={`${nodeClass} col-start-1 row-start-1 self-center`}>Users</div>
          <div className={`${nodeClass} col-start-2 row-start-1 self-center`}>Azure Front Door</div>
          <div className={`${nodeClass} col-start-3 row-start-2 self-center`}>App Gateway</div>
          <div className={`${nodeClass} col-start-3 row-start-3 self-center`}>AKS / App Service</div>
          <div className={`${nodeClass} col-start-2 row-start-3 self-center`}>Key Vault</div>
          <div className={`${nodeClass} col-start-2 row-start-4 self-center`}>Azure SQL</div>
          <div className={`${nodeClass} col-start-3 row-start-4 self-center`}>Monitoring</div>
        </div>
      </aside>
    </MotionWrapper>
  );
}
