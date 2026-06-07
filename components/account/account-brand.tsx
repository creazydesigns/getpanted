import Image from "next/image";

type AccountBrandProps = {
  tag?: string;
  headline?: string;
  subline?: string;
};

export function AccountBrand({
  tag = "Client Area",
  headline = "Welcome back",
  subline = "Your orders, wishlist, and preferences — curated for you.",
}: AccountBrandProps) {
  return (
    <aside className="account-brand-panel" aria-hidden="false">
      <div className="account-brand-inner">
        <Image
          src="/images/gp_favicon.svg"
          alt="GetPanted"
          width={56}
          height={56}
          className="account-brand-logo"
          priority
        />
        <p className="account-brand-wordmark font-playfair">
          <span className="account-brand-wordmark-dark">Get</span>
          <span className="account-brand-wordmark-accent">Panted</span>
        </p>
        <span className="account-brand-tag font-barlow-cond">{tag}</span>
        <div className="account-brand-rule" />
        <h2 className="account-brand-headline font-playfair">{headline}</h2>
        <p className="account-brand-subline font-barlow">{subline}</p>
      </div>
    </aside>
  );
}
