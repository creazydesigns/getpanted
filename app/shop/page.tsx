import Link from "next/link";

const ENTRIES = [
  {
    title: "New Arrivals",
    subtitle: "Fresh drops every week",
    href: "/new-arrivals",
    bg: "from-[#1a1410] to-[#2d1f14]",
  },
  {
    title: "Collections",
    subtitle: "Shop every line and filter",
    href: "/collections",
    bg: "from-[#140f1a] to-[#1e1428]",
  },
  {
    title: "Bespoke",
    subtitle: "Made-to-measure in Lagos",
    href: "/bespoke",
    bg: "from-[#0f1a16] to-[#14241e]",
  },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[var(--gp-canvas)] text-[var(--gp-fg)]">

      <section className="mx-auto max-w-[1400px] px-8 pb-16 pt-24">
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gp-accent)]">Shop</p>
        <h1 className="mb-4 text-[clamp(36px,6vw,64px)] font-light leading-tight">
          Find your <em className="text-[var(--gp-accent)] not-italic">signature</em> pair
        </h1>
        <p className="mb-12 max-w-xl text-sm leading-8 text-[rgb(var(--gp-fg-rgb) / 0.52)]">
          Browse new drops, full collections, or go bespoke. Everything ships from Lagos with the same wide-leg confidence.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden border border-[rgb(var(--gp-fg-rgb) / 0.08)] bg-gradient-to-br p-8 ${entry.bg}`}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 36px)" }} />
              <p className="relative z-10 text-[10px] uppercase tracking-[0.18em] text-[var(--gp-accent)]">{entry.subtitle}</p>
              <h2 className="relative z-10 mt-2 font-cormorant text-2xl font-light text-[var(--gp-fg)]">{entry.title}</h2>
              <span className="relative z-10 mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--gp-fg-rgb) / 0.55)] group-hover:text-[var(--gp-accent)]">
                Enter
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m5 12 14 0M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-[rgb(var(--gp-fg-rgb) / 0.08)] pt-10">
          <Link
            href="/about"
            className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--gp-fg-rgb) / 0.75)] hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)]"
          >
            View lookbook
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent)] underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
