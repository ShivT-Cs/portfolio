import { experience } from "@/content/experience";

export function ExperienceTimeline() {
  return (
    <ol className="mt-10 border-l border-white/15 pl-6">
      {experience.map((item) => (
        <li key={item.title} className="relative mb-10 last:mb-0">
          <span className="absolute -left-[1.8rem] top-1 h-3 w-3 rounded-full bg-accent" />
          <p className="text-xs uppercase tracking-[0.2em] text-accentSoft">{item.period}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.notes}</p>
        </li>
      ))}
    </ol>
  );
}
