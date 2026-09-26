import { expertise } from "@/content/expertise";
import { MotionWrapper } from "@/components/motion-wrapper";

export function ExpertiseGrid() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {expertise.map((group, index) => (
        <MotionWrapper key={group.title} delay={index * 0.05}>
          <article className="h-full rounded-2xl border border-white/10 bg-panel/65 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </MotionWrapper>
      ))}
    </div>
  );
}
