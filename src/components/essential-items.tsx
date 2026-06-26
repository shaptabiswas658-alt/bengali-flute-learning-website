type EssentialItemsProps = {
  title: string;
  subtitle: string;
  items: Array<{
    heading: string;
    details: string;
  }>;
  themeClass: string;
};

export function EssentialItemsSection({ title, subtitle, items, themeClass }: EssentialItemsProps) {
  return (
    <section className={`mt-8 rounded-3xl border bg-white/90 p-6 shadow-lg md:p-8 ${themeClass}`}>
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-slate-700 md:text-base">{subtitle}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.heading} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-900">{item.heading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
