import Link from "next/link";

type Crumb = { label: string; href?: string };

type StorefrontHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  narrow?: boolean;
};

export function StorefrontHeader({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
  narrow = false,
}: StorefrontHeaderProps) {
  return (
    <section className={`hp-section hp-page-header`}>
      <div className={`mx-auto ${narrow ? "max-w-[900px]" : "max-w-[1400px]"}`}>
        {crumbs && crumbs.length > 0 && (
          <nav className="hp-breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span style={{ color: "#1A1A1A" }}>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="hp-eyebrow mb-4">{eyebrow}</p>
            <h1 className="hp-page-title">{title}</h1>
            {description && <p className="hp-body mt-5 max-w-[480px]">{description}</p>}
          </div>
          {actions}
        </div>
      </div>
    </section>
  );
}
