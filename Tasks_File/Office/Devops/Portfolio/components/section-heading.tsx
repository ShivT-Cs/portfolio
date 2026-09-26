type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.28em] text-accentSoft">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-muted">{description}</p> : null}
    </header>
  );
}
