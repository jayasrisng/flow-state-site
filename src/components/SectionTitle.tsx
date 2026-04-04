type SectionTitleProps = {
  eyebrow: string;
  title: string;
  text?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  text,
}: SectionTitleProps) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-base leading-7 text-white/68">{text}</p>}
    </div>
  );
}