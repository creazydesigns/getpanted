import Link from "next/link";

type AccountHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description?: string;
  meta?: string;
  backHref?: string;
  backLabel?: string;
};

export function AccountHero({
  eyebrow,
  title,
  subtitle,
  description,
  meta,
  backHref,
  backLabel,
}: AccountHeroProps) {
  return (
    <section className="account-hero">
      <div className="account-hero-inner">
        {backHref && backLabel && (
          <Link href={backHref} className="account-back-link font-barlow-cond">
            ← {backLabel}
          </Link>
        )}
        <p className="account-eyebrow font-barlow-cond">{eyebrow}</p>
        <h1 className="account-hero-title font-playfair">{title}</h1>
        {meta && <p className="account-hero-meta font-barlow">{meta}</p>}
        {subtitle && <p className="account-hero-subtitle font-barlow">{subtitle}</p>}
        {description && <p className="account-hero-description font-barlow">{description}</p>}
      </div>
    </section>
  );
}
